import pytest
from app import create_app, db
from app.models.user import User


@pytest.fixture
def app():
    app = create_app()
    app.config.update({"TESTING": True, "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"})

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_create_user(client):
    response = client.post("/users/", json={"username": "testuser", "password": "password123"})
    assert response.status_code == 201
    data = response.get_json()
    assert data["username"] == "testuser"
