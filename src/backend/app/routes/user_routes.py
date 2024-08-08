from flask import Blueprint, request, jsonify, url_for
from flask_hal import document, link
from app.models.user import User
from app.extensions import db

bp = Blueprint("user_routes", __name__)


@bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    new_user = User(username=username, password=password)
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


@bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    user_collection = [
        document.Document(
            data={
                "id": user.id,
                "username": user.username,
            },
            links=link.Collection(link.Link("collection", href=url_for("user_routes.get_users", _external=True))),
        )
        for user in users
    ]

    response = document.Document(
        data={"users": user_collection},
        links=link.Collection(),
    )
    return jsonify(response.to_dict())


@bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    response = document.Document(
        data={
            "id": user.id,
            "username": user.username,
        },
        links=link.Collection(
            link.Link("collection", href=url_for("user_routes.get_users", _external=True)),
        ),
    )
    return jsonify(response.to_dict()), 201
