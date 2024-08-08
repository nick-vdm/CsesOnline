from flask import Blueprint, request, jsonify, url_for
from flask_hal import Document, HALJson
from flask_hal.link import Link
from ..models.user import User
from ..extensions import db

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

    response = Document(
        data={
            "id": new_user.id,
            "username": new_user.username,
        },
        links={
            "self": Link(url_for("user_routes.get_user", user_id=new_user.id)),
            "collection": Link(url_for("user_routes.get_users")),
        },
    )>
    return HALJson(response), 201


@bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    response = Document(
        data={
            "id": user.id,
            "username": user.username,
        },
        links={
            "self": Link(url_for("user_routes.get_user", user_id=user.id)),
            "collection": Link(url_for("user_routes.get_users")),
        },
    )
    return HALJson(response)
