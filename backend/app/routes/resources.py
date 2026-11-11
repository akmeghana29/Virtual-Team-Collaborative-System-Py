
import os
import uuid

from flask import (
    Blueprint,
    request,
    jsonify,
    current_app
)
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models.resource import Resource
from app.utils.auth import token_required


resources_bp = Blueprint("resources", __name__)


ALLOWED_EXTENSIONS = {
    "pdf", "doc", "docx",
    "xls", "xlsx", "ppt", "pptx",
    "txt", "csv",
    "png", "jpg", "jpeg",
    "gif", "zip"
}


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


def get_upload_folder():
    upload_folder = os.getenv("UPLOAD_FOLDER")

    if not upload_folder:
        upload_folder = os.path.abspath(
            os.path.join(
                current_app.root_path,
                "..",
                "uploads"
            )
        )

    os.makedirs(upload_folder, exist_ok=True)

    return upload_folder


@resources_bp.route("/upload", methods=["POST"])
@token_required
def upload_resource(current_user):

    uploaded_file = request.files.get("file")
    team_id = request.form.get("teamId")

    if not uploaded_file or not uploaded_file.filename:
        return jsonify({
            "message": "Please select a file to upload"
        }), 400

    if not team_id:
        return jsonify({
            "message": "Team ID is required"
        }), 400

    try:
        team_id = int(team_id)
    except (ValueError, TypeError):
        return jsonify({
            "message": "Invalid team ID"
        }), 400

    if not current_user.team_id or current_user.team_id != team_id:
        return jsonify({
            "message": "You are not authorized to upload to this team"
        }), 403

    original_name = secure_filename(uploaded_file.filename)

    if not original_name or not allowed_file(original_name):
        return jsonify({
            "message": "This file type is not allowed"
        }), 400

    stored_filename = f"{uuid.uuid4().hex}_{original_name}"

    upload_folder = get_upload_folder()

    file_path = os.path.join(
        upload_folder,
        stored_filename
    )

    try:
        uploaded_file.save(file_path)

        file_size = os.path.getsize(file_path)

        if file_size == 0:
            os.remove(file_path)
            return jsonify({
                "message": "Empty files cannot be uploaded"
            }), 400

        if file_size > current_app.config["MAX_CONTENT_LENGTH"]:
            os.remove(file_path)
            return jsonify({
                "message": "File exceeds the maximum upload size"
            }), 413

        new_resource = Resource(
            filename=stored_filename,
            original_name=original_name,
            mimetype=uploaded_file.mimetype or "application/octet-stream",
            size=file_size,
            uploaded_by=current_user.id,
            team_id=team_id,
            storage_path=stored_filename
        )

        db.session.add(new_resource)
        db.session.commit()

        return jsonify({
            "message": "File uploaded successfully",
            "resource": new_resource.to_dict()
        }), 201

    except Exception:
        db.session.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        current_app.logger.exception("Resource upload failed")

        return jsonify({
            "message": "File upload failed"
        }), 500


@resources_bp.route("/<int:team_id>", methods=["GET"])
@token_required
def get_resources(current_user, team_id):

    if current_user.team_id != team_id:
        return jsonify({
            "message": "You are not authorized to access these resources"
        }), 403

    resources = Resource.query.filter_by(
        team_id=team_id
    ).order_by(
        Resource.created_at.desc()
    ).all()

    result = []

    for resource in resources:

        resource_data = resource.to_dict()

        resource_data["uploader"] = {
            "id": resource.uploader.id,
            "name": resource.uploader.name
        }

        result.append(resource_data)

    return jsonify({
        "resources": result
    }), 200


@resources_bp.route("/<int:resource_id>", methods=["DELETE"])
@token_required
def delete_resource(current_user, resource_id):

    resource = db.session.get(Resource, resource_id)

    if not resource:
        return jsonify({
            "message": "Resource not found"
        }), 404

    if resource.team_id != current_user.team_id:
        return jsonify({
            "message": "You are not authorized to delete this resource"
        }), 403

    if (
        resource.uploaded_by != current_user.id
        and current_user.role != "admin"
    ):
        return jsonify({
            "message": "Only the uploader or team admin can delete this resource"
        }), 403

    upload_folder = get_upload_folder()

    file_path = os.path.abspath(
        os.path.join(
            upload_folder,
            resource.storage_path
        )
    )

    if os.path.dirname(file_path) != upload_folder:
        return jsonify({
            "message": "Invalid resource storage path"
        }), 400

    db.session.delete(resource)
    db.session.commit()

    if os.path.exists(file_path):
        os.remove(file_path)

    return jsonify({
        "message": "Resource deleted successfully"
    }), 200
