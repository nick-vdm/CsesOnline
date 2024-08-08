from app.extensions import db
from flask import Flask, request, has_request_context, g
import os
import time
import logging
import logging.config
from flask_hal import HAL


class RequestLogFilter(logging.Filter):
    def filter(self, record):
        if has_request_context():
            record.url = request.url
            record.method = request.method
            record.remote_addr = request.remote_addr
        else:
            record.url = None
            record.method = None
            record.remote_addr = None
        return True


def create_app():
    logging.config.fileConfig("../../logging.conf")
    log = logging.getLogger("app")
    log.info("Creating app")

    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    db.init_app(app)

    log_filter = RequestLogFilter()
    log.addFilter(log_filter)

    @app.before_request
    def log_request_info():
        g.start_time = time.time()

    @app.after_request
    def after_request(response):
        duration = time.time() - g.start_time
        size = len(response.get_data())
        log.info(
            f"Request: {request.remote_addr} {request.method} {request.url} | Size: {size} bytes | Duration: {duration:.2f} seconds"
        )
        return response

    with app.app_context():
        from .routes import user_routes, problem_routes, submission_routes

        app.register_blueprint(user_routes.bp)
        app.register_blueprint(problem_routes.bp)
        app.register_blueprint(submission_routes.bp)

    log.info("App created")
    return app
