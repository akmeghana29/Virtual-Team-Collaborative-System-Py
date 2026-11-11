
from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.team import Team
from app.utils.auth import token_required


teams_bp = Blueprint("teams", __name__)


# Create a new team
@teams_bp.route("/", methods=["POST"])
@token_required
def create_team(current_user):

    data = request.get_json(silent=True) or {}

    if current_user.team_id:
        return jsonify({
            "message": "You already belong to a team"
        }), 409

    name = data.get("name")
    description = data.get("description", "")

    if not isinstance(name, str) or not name.strip():
        return jsonify({
            "message": "A valid team name is required"
        }), 400

    if len(name.strip()) > 120:
        return jsonify({
            "message": "Team name cannot exceed 120 characters"
        }), 400

    if not isinstance(description, str):
        return jsonify({
            "message": "Team description must be text"
        }), 400

    if len(description) > 5000:
        return jsonify({
            "message": "Team description cannot exceed 5000 characters"
        }), 400

    team = Team(
        name=name.strip(),
        description=description.strip()
    )

    try:
        db.session.add(team)
        db.session.flush()

        current_user.team_id = team.id
        current_user.role = "admin"

        db.session.commit()

        return jsonify({
            "message": "Team created successfully",
            "team": team.to_dict()
        }), 201

    except Exception:
        db.session.rollback()

        return jsonify({
            "message": "Team creation failed"
        }), 500


# Get the current user's team
@teams_bp.route("/my-team", methods=["GET"])
@token_required
def get_my_team(current_user):

    if not current_user.team:
        return jsonify({
            "message": "You are not a member of any team"
        }), 404

    return jsonify({
        "team": current_user.team.to_dict()
    }), 200
