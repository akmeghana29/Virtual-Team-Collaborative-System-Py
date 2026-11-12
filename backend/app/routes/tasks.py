
from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, current_app

from app.extensions import db
from app.models.task import Task
from app.models.user import User
from app.utils.auth import token_required
from app.services.task_scheduler import (
    schedule_tasks,
    reschedule_on_completion
)

tasks_bp = Blueprint("tasks", __name__)


def serialize_queue(tasks):
    return [task.to_dict() for task in tasks]


@tasks_bp.route("/", methods=["POST"])
@token_required
def create_task(current_user):

    data = request.get_json() or {}

    name = data.get("name")
    assigned_to = data.get("assignedTo")
    deadline_value = data.get("deadline")

    if not current_user.team_id:
        return jsonify({
            "message": "You must belong to a team"
        }), 400

    if not isinstance(name, str) or not name.strip():
        return jsonify({
            "message": "Task name is required"
        }), 400

    if len(name.strip()) > 255:
        return jsonify({
            "message": "Task name cannot exceed 255 characters"
        }), 400

    try:
        assigned_to = int(assigned_to)

        deadline = datetime.fromisoformat(
            deadline_value.replace("Z", "+00:00")
        )

        if deadline.tzinfo is None:
            deadline = deadline.replace(tzinfo=timezone.utc)

    except (ValueError, TypeError, AttributeError):
        return jsonify({
            "message": "Invalid assigned user or deadline format"
        }), 400

    assigned_user = User.query.filter_by(
        id=assigned_to,
        team_id=current_user.team_id
    ).first()

    if not assigned_user:
        return jsonify({
            "message": "Assigned user must belong to your team"
        }), 400

    new_task = Task(
        name=name.strip(),
        assigned_to=assigned_to,
        team_id=current_user.team_id,
        deadline=deadline
    )

    try:
        db.session.add(new_task)
        db.session.commit()

        team_tasks = Task.query.filter_by(
            team_id=current_user.team_id,
            done=False
        ).all()

        scheduled_queue = schedule_tasks(team_tasks)

        return jsonify({
            "task": new_task.to_dict(),
            "scheduledQueue": serialize_queue(scheduled_queue)
        }), 201

    except Exception:
        db.session.rollback()
        current_app.logger.exception("Task creation failed")

        return jsonify({
            "message": "Task creation failed"
        }), 500


@tasks_bp.route("/<int:team_id>", methods=["GET"])
@token_required
def get_tasks(current_user, team_id):

    if current_user.team_id != team_id:
        return jsonify({
            "message": "You are not authorized to access these tasks"
        }), 403

    tasks = Task.query.filter_by(
        team_id=team_id,
        done=False
    ).all()

    scheduled_queue = schedule_tasks(tasks)

    return jsonify({
        "tasks": serialize_queue(tasks),
        "scheduledQueue": serialize_queue(scheduled_queue)
    }), 200


@tasks_bp.route("/<int:task_id>/complete", methods=["PATCH"])
@token_required
def complete_task(current_user, task_id):

    task = db.session.get(Task, task_id)

    if not task:
        return jsonify({
            "message": "Task not found"
        }), 404

    if task.team_id != current_user.team_id:
        return jsonify({
            "message": "You are not authorized to modify this task"
        }), 403

    task.done = True
    task.completed_at = datetime.now(timezone.utc)

    try:
        db.session.commit()

        team_tasks = Task.query.filter_by(
            team_id=task.team_id
        ).all()

        rescheduled_queue = reschedule_on_completion(
            team_tasks,
            task.id
        )

        return jsonify({
            "task": task.to_dict(),
            "rescheduledQueue": serialize_queue(rescheduled_queue)
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "message": "Task completion failed"
        }), 500


@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
@token_required
def delete_task(current_user, task_id):

    task = db.session.get(Task, task_id)

    if not task:
        return jsonify({
            "message": "Task not found"
        }), 404

    if task.team_id != current_user.team_id:
        return jsonify({
            "message": "You are not authorized to delete this task"
        }), 403

    if current_user.role != "admin":
        return jsonify({
            "message": "Only team admins can delete tasks"
        }), 403

    try:
        db.session.delete(task)
        db.session.commit()

        return jsonify({
            "message": "Task deleted successfully"
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "message": "Task deletion failed"
        }), 500
