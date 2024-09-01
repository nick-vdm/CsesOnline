import datetime
import logging

import bcrypt
import jwt
from flask import Blueprint, request, jsonify, url_for, current_app
from flask_hal import document, link

from code.extensions import db
from code.models import Problem
from code.models.submissions import Submission
from code.models.user import User

bp = Blueprint("user_routes", __name__)
log = logging.getLogger("code")


@bp.route("/api/signup", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # check if user already exists
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({"error": "User already exists"}), 409

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)

    new_user = User(username=username, password=hashed_password.decode("utf-8"))
    db.session.add(new_user)
    db.session.commit()

    response = document.Document(
        data={
            "id": new_user.id,
            "username": new_user.username,
        },
        links=[link.Link("collection", href=url_for("user_routes.get_users", _external=True))],
    )

    return jsonify(response.to_dict()), 201


@bp.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    user_collection = [
        document.Document(
            data={
                "id": user.id,
                "username": user.username,
            },
            links=link.Collection(link.Link("collection", href=url_for("user_routes.get_users", _external=True))),
        ).to_dict()
        for user in users
    ]

    response = document.Document(
        data={"users": user_collection},
        links=link.Collection(),
    )
    return jsonify(response.to_dict())


@bp.route("/api/users/<string:username>", methods=["GET"])
def get_user(username):
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"error": f"User {username} not found"}), 404

    response = document.Document(
        data={
            "id": user.id,
            "username": user.username,
        },
        links=link.Collection(
            link.Link("collection", href=url_for("user_routes.get_users", _external=True)),
        ),
    )
    return jsonify(response.to_dict())


@bp.route("/api/login", methods=["POST"])
def log_user_in():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "Invalid username or password"}), 409

    if bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        # Ensure SECRET_KEY is a string
        secret_key = str(current_app.config["SECRET_KEY"])

        # Generate JWT token with timezone-aware datetime
        token = jwt.encode(
            {"user_id": user.id, "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)},
            secret_key,
            algorithm="HS256",
        )
        return jsonify({"message": "Login successful", "token": token}), 200

    return jsonify({"error": "Invalid username or password"}), 409


@bp.route("/api/users/<string:username>/submissions", methods=["GET"])
def get_user_submissions(username):
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"error": f"User {username} not found"}), 404

    submissions = Submission.query.filter_by(linked_user=user.id).all()

    submission_collection = [
        document.Document(
            data={
                "id": submission.id,
                "title": Problem.query.filter_by(id=submission.problem_id).first().title,
                "program_lang": submission.program_lang,
                "linked_user": submission.linked_user,
                "problem_id": submission.problem_id,
                "status": submission.status,
                "result": submission.result,
                "result_time_ms": submission.result_time_ms,
                "result_memory_kb": submission.result_memory_kb,
            },
            links=link.Collection(
                link.Link("collection", href=url_for("user_routes.get_user_submissions", username=username)),
            ),
        ).to_dict()
        for submission in submissions
    ]

    response = document.Document(
        data={"submissions": submission_collection},
        links=link.Collection(),
    )
    return jsonify(response.to_dict())
