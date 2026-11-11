
from functools import wraps

from flask import jsonify
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity
)

from app.extensions import db
from app.models.user import User


def token_required(fn):

    @wraps(fn)
    def wrapper(*args, **kwargs):

        verify_jwt_in_request()

        user_id = get_jwt_identity()

        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            return jsonify({
                "message": "Invalid authentication token"
            }), 401

        current_user = db.session.get(User, user_id)

        if not current_user:
            return jsonify({
                "message": "User not found"
            }), 404

        return fn(current_user, *args, **kwargs)

    return wrapper
