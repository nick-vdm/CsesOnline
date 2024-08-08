from flask import Flask
from .extensions import db
from .models.user import User


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app
