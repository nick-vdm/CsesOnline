from dataclasses import dataclass
from typing import Dict
import zipfile
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from io import BytesIO

print(os.getcwd())
import requests
from bs4 import BeautifulSoup
from code.models.problem import Problem as DBProblem, DifficultyEnum

base_url = "https://cses.fi"


@dataclass
class Problem:
    db_id: int = -1
    tests_id: str = ""
    title: str = ""
    problem_description: str = ""
    group: str = ""
    link: str = ""


def next_problem_link():
    response = requests.get(base_url + "/problemset/")
    soup = BeautifulSoup(response.content, "html.parser")

    current_group = ""
    for element in soup.find_all(["h2", "a"]):
        if element.name == "h2":
            current_group = element.get_text(strip=True)
        elif element.name == "a" and "task" in element.get("href", ""):
            title = element.get_text(strip=True)
            link = element["href"]
            yield Problem(
                title=title,
                problem_description="",
                group=current_group,
                link=link,
                tests_id="cses_" + link.split("/")[-1],
            )


def scrape_problem_description(problem: Problem):
    url = base_url + problem.link
    response = requests.get(url)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    content_div = soup.find("div", class_="content")
    if content_div:
        return str(content_div)
    else:
        return None


# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Set up the database connection
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()


def insert_or_update_problem(problem):
    existing_problem = session.query(DBProblem).filter_by(title=problem.title).first()

    if existing_problem:
        problem.db_id = existing_problem.id
    else:
        content = scrape_problem_description(problem)
        new_problem = DBProblem(
            title=problem.title,
            difficulty=DifficultyEnum.EASY,
            problem_description=content,
            problem_link=base_url + problem.link,
            tags=[],
            tests_id=problem.tests_id,
        )
        session.add(new_problem)
        session.commit()
        problem.db_id = new_problem.id

    return problem


def scrape_test_cases(problem: Problem):
    session = requests.Session()
    test_cases_url = base_url + "/problemset/tests/" + problem.link.split("/")[-1] + "/"
    print("Fetching", test_cases_url)

    form_data = {"csrf_token": os.getenv("CSRF_TOKEN"), "download": "true"}
    headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-GB,en;q=0.6",
        "cache-control": "max-age=0",
        "connection": "keep-alive",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://cses.fi",
        "referer": test_cases_url,
        "sec-ch-ua": '"Not)A;Brand";v="99", "Brave";v="127", "Chromium";v="127"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "sec-gpc": "1",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        "cookie": f"PHPSESSID={os.getenv('COOKIE')}",
    }
    print(form_data, headers["cookie"])

    response = session.post(test_cases_url, data=form_data, headers=headers)

    if response.status_code == 200:
        zip_data = BytesIO(response.content)
        print("Test cases downloaded successfully.")

        test_cases = {}
        with zipfile.ZipFile(zip_data, "r") as zip_ref:
            for file_name in zip_ref.namelist():
                with zip_ref.open(file_name) as file:
                    test_cases[file_name] = file.read().decode("utf-8")
        print("Test cases loaded into variable.", len(test_cases))

        return test_cases
    else:
        print(f"Failed to download test cases. Status code: {response.status_code}")
        return None


def save_test_cases(folder_path, data_dict: Dict[str, str]):
    os.makedirs(folder_path, exist_ok=True)

    for file_name, file_content in data_dict.items():
        # Step 3: Write each key-value pair to a file
        file_path = os.path.join(folder_path, file_name)
        with open(file_path, "w") as file:
            file.write(file_content)


if __name__ == "__main__":
    for problem in next_problem_link():
        content = scrape_problem_description(problem)
        problem = insert_or_update_problem(problem)
        tests = scrape_test_cases(problem)
        save_test_cases(os.getenv("SAVE_PATH") + "/" + problem.tests_id, tests)
        print(str(problem))
        print("Content", len(content))
    pass
