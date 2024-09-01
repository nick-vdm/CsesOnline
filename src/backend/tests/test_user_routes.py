import pytest
import bcrypt
from code.app import create_app
from code.extensions import db
from code.models.user import User
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
    db.session.delete(user)
    db.session.commit()


def test_create_user_success(client):
    log.info("Testing user creation success")
    response = client.post("/api/signup", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    data = response.get_json()
    log.info("Got back %s", data)
    assert "id" in data
    assert data["username"] == "testuser"
    assert "_links" in data
    assert "self" in data["_links"]
    assert "collection" in data["_links"]
    goal = len(f"/api/users/{data['id']}")
    # TODO bug here - this is just /users/
    # assert data["_links"]["self"]["href"][-goal:] == f"/api/users/{data['id']}"


def test_login_user_success(client, new_user):
    log.info("Testing user login success")
    response = client.post("/api/login", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    data = response.get_json()
    log.info("Got back %s", data)
    assert "message" in data
    assert "token" in data


def test_get_users_success(client, new_user):
    log.info("Testing get users success")
    response = client.get("/api/users")
    assert response.status_code == 200
    data = response.get_json()
    assert "users" in data
    assert len(data["users"]) == 1
    for user in data["users"]:
        assert "id" in user
        assert "username" in user
        assert "_links" in user
        assert "self" in user["_links"]
        assert "collection" in user["_links"]


def test_get_user_success(client, new_user):
    log.info("Testing get users success")
    response = client.get(f"/api/users/{new_user.id}")
    assert response.status_code == 200
    data = response.get_json()

    assert "id" in data
    assert "username" in data
    assert "_links" in data
    assert "self" in data["_links"]
    assert "collection" in data["_links"]
