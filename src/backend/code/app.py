import os
from threading import Thread

from code.services.ProblemRunner import query_pending_submissions

print("My working dir is,", os.getcwd())

from code.extensions import db
from dotenv import load_dotenv
from flask import Flask, request, has_request_context, g
import time
import logging
import logging.config
import os

from flask_cors import CORS


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
    print("Looking from", os.getcwd())
    print(f'Logging folder: {os.getenv('LOGGING_FOLDER')}')
    logging.config.fileConfig("logging.conf")
    log = logging.getLogger("app")
    log.info("Creating code")

    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

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
        from code.routes import user_routes, problem_routes, submission_routes

        app.register_blueprint(user_routes.bp)
        app.register_blueprint(problem_routes.bp)
        app.register_blueprint(submission_routes.bp)

    log.info("App created")

    print("Database URI is", app.config["SQLALCHEMY_DATABASE_URI"])
    return app


if __name__ == '__main__':
    load_dotenv()
    app = create_app()
    app.config["TESTING"] = False
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

    # Start ProblemRunner
    query_thread = Thread(target=query_pending_submissions, args=(app, ), daemon=True)
    query_thread.start()
    app.run(host='0.0.0.0', port=5000)

