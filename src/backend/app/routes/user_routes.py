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

    user_link = link.Link("self", href=url_for("user_routes.get_user", user_id=new_user.id, _external=True))
    collection_link = link.Link("collection", href=url_for("user_routes.get_users", _external=True))

    response = {
        "id": new_user.id,
        "username": new_user.username,
        "_links": user_link.to_dict() | collection_link.to_dict(),
    }

    return jsonify(response), 201


@bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    response = {
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "_links": link.Link("self", href=url_for("user_routes.get_user", user_id=user.id)).to_dict()
                | link.Link("collection", href=url_for("user_routes.get_users")).to_dict(),
            }
            for user in users
        ]
    }
    return jsonify(response)


@bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    response = document.Document(
        data={
            "id": user.id,
            "username": user.username,
        },
        links=link.Link(href=url_for("user_routes.get_user", user_id=user.id)).to_dict()
        | link.Link(href=url_for("user_routes.get_users")).to_dict(),
    )
    return jsonify(response.to_dict()), 201
