import logging
import os
import subprocess
import tempfile
import time
from queue import Queue
from threading import Thread

import docker
from dotenv import load_dotenv

from code.extensions import db
from code.models import Problem
from code.models.submissions import Submission

load_dotenv()
INTERVAL = int(os.getenv("CHECK_INTERVAL", 60))
MAX_WORKERS = int(os.getenv("MAX_WORKERS", 5))
TESTCASE_DIR = os.getenv("TESTCASE_DIR", "/path/to/testcases")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = docker.from_env()

work_queue = Queue()


def query_pending_submissions():
    query_thread = Thread(target=query_pending_submissions)
    query_thread.start()

    threads = []
    for _ in range(MAX_WORKERS):
        t = Thread(target=worker)
        t.start()
        threads.append(t)

    while True:
        pending_submissions = Submission.query.filter_by(status="PENDING").all()
        for submission in pending_submissions:
            work_queue.put(submission)
        time.sleep(INTERVAL)


def worker():
    while True:
        submission = work_queue.get()
        if submission is None:
            break
        process_submission(submission)
        work_queue.task_done()


def process_submission(submission):
    try:
        test_cases = find_test_cases(submission.problem_id)
        if not test_cases:
            logger.error(f"No test cases found for problem {submission.problem_id}")
            return

        result, output, error = run_code_in_docker(submission.code, test_cases)

        if compare_output(output, submission.problem_id):
            submission.status = "SUCCESS"
        else:
            submission.status = "FAILED"
            submission.error_text = error

        submission.output_text = output
        submission.error_text = error
        submission.result = result
        db.session.commit()
    except Exception as e:
        logger.error(f"Error processing submission {submission.id}: {e}")


def find_test_cases(problem_id):
    problem = Problem.query.get(problem_id)
    if not problem or not problem.tests_id:
        return None

    test_case_dir = os.path.join(TESTCASE_DIR, problem.tests_id)
    if not os.path.exists(test_case_dir):
        return None

    test_cases = {}
    for file in os.listdir(test_case_dir):
        if file.endswith(".in"):
            base_name = file[:-3]
            out_file = f"{base_name}.out"
            if os.path.exists(os.path.join(test_case_dir, out_file)):
                test_cases[file] = out_file

    return test_cases


def run_code_in_docker(code, test_cases):
    with tempfile.TemporaryDirectory() as temp_dir:
        code_file_path = os.path.join(temp_dir, "submission.py")
        with open(code_file_path, "w") as code_file:
            code_file.write(code)

        results = []
        for in_file, out_file in test_cases.items():
            in_file_path = os.path.join(TESTCASE_DIR, in_file)
            out_file_path = os.path.join(TESTCASE_DIR, out_file)

            with open(in_file_path, "r") as input_file:
                input_data = input_file.read()

            command = [
                "docker", "run", "--rm",
                "-v", f"{temp_dir}:/mnt",
                "python:3.8",
                "python", "/mnt/submission.py"
            ]

            process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = process.communicate(input=input_data.encode())

            with open(out_file_path, "r") as expected_output_file:
                expected_output = expected_output_file.read()

            results.append({
                "input": input_data,
                "output": stdout.decode(),
                "expected_output": expected_output,
                "error": stderr.decode()
            })

    return results


def compare_output(output, problem_id):
    """
    Compares the output of the code with the expected output for the probleimport os
    """
    pass
