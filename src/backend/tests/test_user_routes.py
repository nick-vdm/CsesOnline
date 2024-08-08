import pytest
from app.app import create_app
from app.extensions import db
from app.models.user import User
from dotenv import load_dotenv
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
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_create_user_success(client):
    log.info("Testing user creation success")
    response = client.post("/users", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    data = response.get_json()
    assert "id" in data
    assert data["username"] == "testuser"
    assert "_links" in data
    assert "self" in data["_links"]
    assert "collection" in data["_links"]
    assert data["_links"]["self"]["href"] == f"/users/{data['id']}"
    assert data["_links"]["collection"]["href"] == "/users"


def test_get_users_success(client):
    log.info("Testing get users success")
    response = client.get("/users")
    assert response.status_code == 200
    data = response.get_json()
    assert "users" in data
    for user in data["users"]:
        assert "id" in user
        assert "username" in user
        assert "_links" in user
        assert "self" in user["_links"]
        assert "collection" in user["_links"]
        assert user["_links"]["self"]["href"] == f"/users/{user['id']}"
        assert user["_links"]["collection"]["href"] == "/users"


def test_get_user_success(client):
    log.info("Testing get user success")
    # First, create a user
    response = client.post("/users", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    user_id = response.get_json()["id"]

    # Now, get the created user
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    data = response.get_json()
    assert "id" in data
    assert data["id"] == user_id
    assert "username" in data
    assert data["username"] == "testuser"
    assert "_links" in data
    assert "self" in data["_links"]
    assert "collection" in data["_links"]
    assert data["_links"]["self"]["href"] == f"/users/{user_id}"
    assert data["_links"]["collection"]["href"] == "/users"