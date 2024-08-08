import pytest
from app.app import create_app
from app.extensions import db
from app.models.submissions import Submission
from app.models.user import User
from app.models.problem import Problem
from dotenv import load_dotenv
from sqlalchemy import text
import os
import logging

load_dotenv()

log = logging.getLogger("app")


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
def new_user():
    user = User(username="testuser", password="testpassword")
    db.session.add(user)
    db.session.commit()
    yield user
    db.session.delete(user)
    db.session.commit()


@pytest.fixture
def new_problem():
    problem = Problem(title="Sample Problem", markdown_text="Sample Description")
    db.session.add(problem)
    db.session.commit()
    yield problem
    db.session.delete(problem)
    db.session.commit()


@pytest.fixture
def new_submission(new_user, new_problem):
    submission = Submission(
        program_lang="Python",
        code="print('Hello, World!')",
        linked_user=new_user.id,
        problem_id=new_problem.id,
        status="PENDING",
    )
    db.session.add(submission)
    db.session.commit()
    yield submission
    db.session.delete(submission)
    db.session.commit()


def test_get_submissions_success(client, new_submission):
    log.info("Testing get submissions success")
    response = client.get("/submissions")
    assert response.status_code == 200
    data = response.get_json()
    assert "submissions" in data
    assert len(data["submissions"]) == 1
    for submission in data["submissions"]:
        assert "id" in submission
        assert "program_lang" in submission
        assert "linked_user" in submission
        assert "problem_id" in submission
        assert "status" in submission
        assert "_links" in submission
        assert "self" in submission["_links"]
        assert "collection" in submission["_links"]


def test_get_submission_success(client, new_submission):
    log.info("Testing get submission success")
    response = client.get(f"/submissions/{new_submission.id}")
    assert response.status_code == 200
    data = response.get_json()

    assert "id" in data
    assert "program_lang" in data
    assert "linked_user" in data
    assert "problem_id" in data
    assert "status" in data
    assert "_links" in data
    assert "self" in data["_links"]
    assert "collection" in data["_links"]
