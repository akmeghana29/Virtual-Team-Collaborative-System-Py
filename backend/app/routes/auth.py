
import re

from flask import Blueprint, request, jsonify

from app.extensions import db, bcrypt
from app.models.user import User
from app.utils.tokens import generate_token
from app.utils.auth import token_required


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({
            "message": "Name, email and password are required"
        }), 400

    if len(name) > 120:
        return jsonify({
            "message": "Name cannot exceed 120 characters"
        }), 400

    if not re.fullmatch(
        r"[^@\s]+@[^@\s]+\.[^@\s]+",
        email
    ):
        return jsonify({
            "message": "Please provide a valid email address"
        }), 400

    if len(password) < 8:
        return jsonify({
            "message": "Password must contain at least 8 characters"
        }), 400

    if len(password) > 128:
        return jsonify({
            "message": "Password cannot exceed 128 characters"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "message": "User already exists"
        }), 409

    password_hash = bcrypt.generate_password_hash(
        password
    ).decode("utf-8")

    new_user = User(
        name=name,
        email=email,
        password_hash=password_hash,
        role="member"
    )

    db.session.add(new_user)
    db.session.commit()

    token = generate_token(new_user)

    return jsonify({
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(
        user.password_hash,
        password
    ):
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    token = generate_token(user)

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 200


@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user(current_user):

    return jsonify({
        "user": current_user.to_dict()
    }), 200
