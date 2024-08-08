import pytest
from app.app import create_app
from app.extensions import db
from app.models.user import User
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

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
    response = client.post("/users", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    data = response.get_json()
    assert "id" in data
    assert data["username"] == "testuser"

def test_create_user_missing_fields(client):
    response = client.post("/users", json={"username": "testuser"})
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Username and password are required"