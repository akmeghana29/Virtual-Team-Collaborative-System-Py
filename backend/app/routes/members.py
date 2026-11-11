
from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.user import User
from app.utils.auth import token_required


members_bp = Blueprint("members", __name__)


def is_team_admin(user):
    return bool(user.team_id and user.role == "admin")


# Get all members of the current user's team
@members_bp.route("/", methods=["GET"])
@token_required
def get_members(current_user):

    if not current_user.team_id:
        return jsonify({
            "message": "You are not a member of any team"
        }), 400

    members = User.query.filter_by(
        team_id=current_user.team_id
    ).order_by(
        User.created_at.asc()
    ).all()

    return jsonify({
        "members": [member.to_dict() for member in members]
    }), 200


# Invite an existing registered user to the team
@members_bp.route("/invite", methods=["POST"])
@token_required
def invite_member(current_user):

    if not is_team_admin(current_user):
        return jsonify({
            "message": "Only team admins can invite members"
        }), 403

    data = request.get_json(silent=True) or {}

    email = data.get("email")

    if not isinstance(email, str) or not email.strip():
        return jsonify({
            "message": "A valid email address is required"
        }), 400

    email = email.strip().lower()

    if len(email) > 255 or "@" not in email:
        return jsonify({
            "message": "Invalid email address"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "message": "No registered user found with this email"
        }), 404

    if user.id == current_user.id:
        return jsonify({
            "message": "You are already a member of this team"
        }), 409

    if user.team_id:
        return jsonify({
            "message": "This user already belongs to a team"
        }), 409

    try:
        user.team_id = current_user.team_id
        user.role = "member"

        db.session.commit()

        return jsonify({
            "message": "Member added successfully",
            "member": user.to_dict()
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "message": "Unable to add member"
        }), 500


# Remove a member from the team
@members_bp.route("/<int:user_id>", methods=["DELETE"])
@token_required
def remove_member(current_user, user_id):

    if not is_team_admin(current_user):
        return jsonify({
            "message": "Only team admins can remove members"
        }), 403

    if current_user.id == user_id:
        return jsonify({
            "message": "You cannot remove yourself as team admin"
        }), 400

    member = User.query.filter_by(
        id=user_id,
        team_id=current_user.team_id
    ).first()

    if not member:
        return jsonify({
            "message": "Member not found in your team"
        }), 404

    if member.role == "admin":
        return jsonify({
            "message": "Team admins cannot be removed through this endpoint"
        }), 403

    try:
        member.team_id = None
        member.role = "member"

        db.session.commit()

        return jsonify({
            "message": "Member removed successfully"
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "message": "Unable to remove member"
        }), 500
