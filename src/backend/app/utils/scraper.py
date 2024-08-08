from dataclasses import dataclass
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

print(os.getcwd())
import requests
from bs4 import BeautifulSoup
from app.models.problem import Problem as DBProblem, DifficultyEnum

base_url = "https://cses.fi"


@dataclass
class Problem:
    db_id: int = -1
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
            yield Problem(title=title, problem_description="", group=current_group, link=link)


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


def scrape_test_cases():
    pass


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
        )
        session.add(new_problem)
        session.commit()
        problem.db_id = new_problem.id

    return problem


if __name__ == "__main__":
    for problem in next_problem_link():
        content = scrape_problem_description(problem)
        problem = insert_or_update_problem(problem)
        print(str(problem))
        print("Content", len(content))

        scrape_test_cases()
    pass
