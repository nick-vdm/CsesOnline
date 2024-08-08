from app.extensions import db
from flask import Flask
import os
import logging
import logging.config


def create_app():
    # probably kind of lazy of me to do this like this
    logging.config.fileConfig("../../logging.conf")
    log = logging.getLogger("app")
    log.info("Creating app")

    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
    db.init_app(app)

    with app.app_context():
        from .routes import user_routes

        app.register_blueprint(user_routes.bp)

    log.info("App created")
    return app
