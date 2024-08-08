from dataclasses import dataclass
import requests
from bs4 import BeautifulSoup

base_url = "https://cses.fi/problemset/"


@dataclass
class Problem:
    title: str = ""
    markdown_text: str = ""
    group: str = ""
    link: str = ""


def next_problem_link():
    """
    generator function. gets the next link on
    https://cses.fi/problemset/
    """
    response = requests.get(base_url)
    soup = BeautifulSoup(response.content, "html.parser")

    current_group = ""
    for element in soup.find_all(["h2", "a"]):
        if element.name == "h2":
            current_group = element.get_text(strip=True)
        elif element.name == "a" and "task" in element.get("href", ""):
            title = element.get_text(strip=True)
            link = element["href"]
            yield Problem(title=title, markdown_text="", group=current_group, link=link)


def scrape_problem_description(link):
    """
    fetches the title and markdown text of a problem
    """
    pass


def scrape_test_cases():
    pass


if __name__ == "__main__":
    for problem in next_problem_link():
        print(str(problem))
        scrape_problem_description(problem)
        scrape_test_cases()
    pass
