from dataclasses import dataclass
import requests
from bs4 import BeautifulSoup

base_url = "https://cses.fi"


@dataclass
class Problem:
    title: str = ""
    markdown_text: str = ""
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
            yield Problem(title=title, markdown_text="", group=current_group, link=link)


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


if __name__ == "__main__":
    for problem in next_problem_link():
        print(str(problem))
        content = scrape_problem_description(problem)
        print(content)
        scrape_test_cases()
    pass
