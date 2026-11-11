
from datetime import datetime, timezone

from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(120),
        nullable=False
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(50),
        default="member",
        nullable=False
    )

    team_id = db.Column(
        db.Integer,
        db.ForeignKey("teams.id"),
        nullable=True
    )

    avatar = db.Column(
        db.String(500),
        default="",
        nullable=False
    )

    online = db.Column(
        db.Boolean,
        default=False,
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

    team = db.relationship(
        "Team",
        back_populates="members"
    )

    assigned_tasks = db.relationship(
        "Task",
        back_populates="assigned_user",
        foreign_keys="Task.assigned_to",
        lazy=True
    )

    uploaded_resources = db.relationship(
        "Resource",
        back_populates="uploader",
        foreign_keys="Resource.uploaded_by",
        lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "team_id": self.team_id,
            "avatar": self.avatar,
            "online": self.online,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
