import pytest
from code.app import create_app
import bcrypt
from code.extensions import db
from code.models.submissions import Submission
from code.models.user import User
from code.models.problem import Problem
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
def new_user():
    password = "testpassword"
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    user = User(username="testuser", password=hashed_password.decode("utf-8"))
    db.session.add(user)
    db.session.commit()
    yield user


@pytest.fixture
def new_problem():
    problem = Problem(title="Sample Problem", problem_description="Sample Description")
    db.session.add(problem)
    db.session.commit()
    yield problem


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

    db.session.delete(new_problem)
    db.session.commit()

    db.session.delete(new_user)
    db.session.commit()


def test_get_submissions_success(client, new_submission):
    log.info("Testing get submissions success")
    response = client.get("/api/submissions")
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
        assert "result" in submission
        assert "result_time_ms" in submission
        assert "result_memory_kb" in submission
        assert "_links" in submission
        assert "self" in submission["_links"]
        assert "collection" in submission["_links"]


def test_get_submission_success(client, new_submission):
    log.info("Testing get submission success")
    response = client.get(f"/api/submissions/{new_submission.id}")
    assert response.status_code == 200
    data = response.get_json()

    assert "id" in data
    assert "program_lang" in data
    assert "linked_user" in data
    assert "problem_id" in data
    assert "status" in data
    assert "result" in data
    assert "result_time_ms" in data
    assert "result_memory_kb" in data
    assert "_links" in data
    assert "self" in data["_links"]
    assert "collection" in data["_links"]


def test_create_submission_success(client, new_user, new_problem):
    response = client.post("/api/login", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    data = response.get_json()
    token = data["token"]

    payload = {
        "program_lang": "python",
        "code": "print('Hello, World!')",
        "problem_id": new_problem.id,
        "status": "PENDING",
        "result": None,
        "result_time_ms": None,
        "result_memory_kb": None,
        "output_text": None,
        "error_text": None,
    }

    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/create_submission", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Submission created successfully!"
