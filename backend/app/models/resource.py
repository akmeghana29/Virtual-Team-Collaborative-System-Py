
from datetime import datetime, timezone

from app.extensions import db


class Resource(db.Model):
    __tablename__ = "resources"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    filename = db.Column(
        db.String(255),
        nullable=False
    )

    original_name = db.Column(
        db.String(255),
        nullable=False
    )

    mimetype = db.Column(
        db.String(150),
        nullable=False
    )

    size = db.Column(
        db.BigInteger,
        nullable=False
    )

    uploaded_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    team_id = db.Column(
        db.Integer,
        db.ForeignKey("teams.id"),
        nullable=False
    )

    storage_path = db.Column(
        db.String(500),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    uploader = db.relationship(
        "User",
        back_populates="uploaded_resources",
        foreign_keys=[uploaded_by]
    )

    team = db.relationship(
        "Team",
        back_populates="resources"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "originalName": self.original_name,
            "mimetype": self.mimetype,
            "size": self.size,
            "uploadedBy": self.uploaded_by,
            "teamId": self.team_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
