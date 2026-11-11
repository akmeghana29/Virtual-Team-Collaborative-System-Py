
from datetime import datetime, timezone

from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.deadline import Deadline
from app.utils.auth import token_required


deadlines_bp = Blueprint("deadlines", __name__)


@deadlines_bp.route("/", methods=["POST"])
@token_required
def create_deadline(current_user):

    data = request.get_json(silent=True) or {}

    if not current_user.team_id:
        return jsonify({
            "message": "You must belong to a team"
        }), 400

    title = data.get("title")
    due_date_value = data.get("due_date")
    description = data.get("description", "")

    if not isinstance(title, str) or not title.strip():
        return jsonify({
            "message": "A valid deadline title is required"
        }), 400

    if len(title.strip()) > 255:
        return jsonify({
            "message": "Title cannot exceed 255 characters"
        }), 400

    if not isinstance(description, str):
        return jsonify({
            "message": "Description must be text"
        }), 400

    if not isinstance(due_date_value, str):
        return jsonify({
            "message": "A valid due_date is required"
        }), 400

    try:
        due_date = datetime.fromisoformat(
            due_date_value.replace("Z", "+00:00")
        )

        if due_date.tzinfo is None:
            due_date = due_date.replace(tzinfo=timezone.utc)

    except ValueError:
        return jsonify({
            "message": "due_date must be a valid ISO 8601 datetime"
        }), 400

    deadline = Deadline(
        title=title.strip(),
        description=description.strip(),
        due_date=due_date,
        team_id=current_user.team_id,
        created_by=current_user.id
    )

    try:
        db.session.add(deadline)
        db.session.commit()

        return jsonify({
            "message": "Deadline created successfully",
            "deadline": deadline.to_dict()
        }), 201

    except Exception:
        db.session.rollback()

        return jsonify({
            "message": "Deadline creation failed"
        }), 500


@deadlines_bp.route("/<int:team_id>", methods=["GET"])
@token_required
def get_deadlines(current_user, team_id):

    if not current_user.team_id or current_user.team_id != team_id:
        return jsonify({
            "message": "You are not authorized to access this team's deadlines"
        }), 403

    deadlines = Deadline.query.filter_by(
        team_id=team_id
    ).order_by(
        Deadline.due_date.asc()
    ).all()

    return jsonify({
        "deadlines": [
            deadline.to_dict() for deadline in deadlines
        ]
    }), 200
