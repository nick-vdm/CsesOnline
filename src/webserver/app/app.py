from app.extensions import db
from flask import Flask
import os


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
    db.init_app(app)

    with app.app_context():
        from .routes import user_routes

        app.register_blueprint(user_routes.bp)

    return app
