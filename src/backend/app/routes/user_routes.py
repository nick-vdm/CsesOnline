from flask import Blueprint, request, jsonify
from ..models.user import User
from ..extensions import db

bp = Blueprint('user_routes', __name__)

@bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [{"id": user.id, "username": user.username} for user in users]
    return jsonify(users_list)

@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"id": new_user.id, "username": new_user.username}), 201