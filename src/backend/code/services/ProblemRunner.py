import logging.config
import os
import tempfile
import time
from queue import Queue
from threading import Thread

from dotenv import load_dotenv

from code.extensions import db
from code.models import Problem
from code.models.submissions import Submission

load_dotenv()
INTERVAL = int(os.getenv("CHECK_INTERVAL", 60))
MAX_WORKERS = int(os.getenv("MAX_WORKERS", 5))
TESTCASE_DIR = os.getenv("TESTCASE_DIR", "/path/to/testcases")

print("Setting up problem runner logger")
print(f'Logging folder: {os.getenv('LOGGING_FOLDER')}')
logging.config.fileConfig("logging.conf")
log = logging.getLogger("app")
work_queue = Queue()


def query_pending_submissions(app):
    with app.app_context():
        threads = []
        for _ in range(MAX_WORKERS):
            t = Thread(target=worker, daemon=True, args=(app,))
            t.start()
            threads.append(t)

        print(f"Beginning to query pending submissions interval={INTERVAL}")
        while True:
            print("Query...")
            log.info("Checking for pending submissions")

            pending_submissions = Submission.query.filter_by(status="PENDING").all()

            if len(pending_submissions) == 0:
                log.info("No pending submissions found")
            else:
                log.info(f"Found {len(pending_submissions)} pending submissions")

            for submission in pending_submissions:
                work_queue.put(submission)

            time.sleep(INTERVAL)


def worker(app):
    with app.app_context():
        while True:
            submission = work_queue.get()
            if submission is None:
                time.sleep(INTERVAL / 6)
            else:
                process_submission(submission)
                work_queue.task_done()


def process_submission(submission):
    try:
        test_cases = find_test_cases(submission.problem_id)
        if not test_cases:
            log.error(f"No test cases found for problem {submission.problem_id}")
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
        log.error(f"Error processing submission {submission.id}: {e}")


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

            container = client.containers.run(
                "python:3.8",
                "python /mnt/submission.py",
                volumes={temp_dir: {'bind': '/mnt', 'mode': 'rw'}},
                detach=True,
                stdin_open=True
            )

            stdout, stderr = container.communicate(input=input_data.encode())
            container.wait()

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
