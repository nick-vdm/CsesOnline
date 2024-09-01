import pytest
from code.app import create_app
from code.extensions import db
from code.models.problem import Problem, DifficultyEnum
from dotenv import load_dotenv
from sqlalchemy import text
import os
import logging

load_dotenv()

log = logging.getLogger("code")


@pytest.fixture
def app():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

    with app.app_context():
        db.session.execute(text("delete from submissions cascade;"))
        db.session.execute(text("delete from users cascade;"))
        db.session.execute(text("delete from problems cascade;"))
        yield app
        db.session.remove()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def new_problem():
    problem = Problem(
        title="Sample Problem",
        difficulty=DifficultyEnum.EASY,
        problem_description="This is a sample problem.",
        tags=["sample", "test"],
    )
    db.session.add(problem)
    db.session.commit()
    yield problem
    db.session.delete(problem)
    db.session.commit()


def test_get_problems_success(client, new_problem):
    log.info("Testing get problems success")
    response = client.get("/api/problems")
    assert response.status_code == 200
    log.info("Got back %s", response)
    data = response.get_json()
    log.info("Got back %s", data)
    assert "problems" in data
    assert len(data["problems"]) == 1
    for problem in data["problems"]:
        assert "id" in problem
        assert "title" in problem
        assert "difficulty" in problem
        assert "problem_description" not in problem
        assert "tags" in problem
        assert "_links" in problem
        assert "self" in problem["_links"]
        assert "collection" in problem["_links"]


def test_get_problem_success(client, new_problem):
    log.info("Testing get problem by ID success")
    response = client.get(f"/api/problems/{new_problem.id}")
    assert response.status_code == 200

    data = response.get_json()
    log.info("Got back %s", data)
    assert "id" in data
    assert data["id"] == new_problem.id
    assert data["title"] == new_problem.title
    assert data["difficulty"] == new_problem.difficulty.value
    assert data["problem_description"] == new_problem.problem_description
    assert data["tags"] == new_problem.tags
    assert "_links" in data
    assert "self" in data["_links"]
    assert "collection" in data["_links"]
    goal = len(f"/api/problems/{data['id']}")
    assert data["_links"]["self"]["href"][-goal:] == f"/api/problems/{data['id']}"
