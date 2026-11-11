
from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.standup import Standup
from app.utils.auth import token_required


standups_bp = Blueprint("standups", __name__)


@standups_bp.route("/", methods=["POST"])
@token_required
def create_standup(current_user):

    data = request.get_json(silent=True) or {}

    if not current_user.team_id:
        return jsonify({
            "message": "You must belong to a team"
        }), 400

    yesterday = data.get("yesterday")
    today = data.get("today")
    blockers = data.get("blockers", "")

    if not isinstance(yesterday, str) or not yesterday.strip():
        return jsonify({
            "message": "Yesterday's update is required"
        }), 400

    if not isinstance(today, str) or not today.strip():
        return jsonify({
            "message": "Today's update is required"
        }), 400

    if not isinstance(blockers, str):
        return jsonify({
            "message": "Blockers must be text"
        }), 400

    if (
        len(yesterday) > 5000
        or len(today) > 5000
        or len(blockers) > 5000
    ):
        return jsonify({
            "message": "Standup updates cannot exceed 5000 characters each"
        }), 400

    standup = Standup(
        user_id=current_user.id,
        team_id=current_user.team_id,
        yesterday=yesterday.strip(),
        today=today.strip(),
        blockers=blockers.strip()
    )

    try:
        db.session.add(standup)
        db.session.commit()

        return jsonify({
            "message": "Standup submitted successfully",
            "standup": standup.to_dict()
        }), 201

    except Exception:
        db.session.rollback()

        return jsonify({
            "message": "Standup submission failed"
        }), 500


@standups_bp.route("/<int:team_id>", methods=["GET"])
@token_required
def get_standups(current_user, team_id):

    if not current_user.team_id or current_user.team_id != team_id:
        return jsonify({
            "message": "You are not authorized to access this team's standups"
        }), 403

    standups = Standup.query.filter_by(
        team_id=team_id
    ).order_by(
        Standup.created_at.desc()
    ).all()

    return jsonify({
        "standups": [
            standup.to_dict()
            for standup in standups
        ]
    }), 200
