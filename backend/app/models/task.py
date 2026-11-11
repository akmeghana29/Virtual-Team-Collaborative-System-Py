
from datetime import datetime, timezone

from app.extensions import db


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(255),
        nullable=False
    )

    assigned_to = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    team_id = db.Column(
        db.Integer,
        db.ForeignKey("teams.id"),
        nullable=False
    )

    deadline = db.Column(
        db.DateTime(timezone=True),
        nullable=False
    )

    done = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    completed_at = db.Column(
        db.DateTime(timezone=True),
        nullable=True
    )

    priority = db.Column(
        db.Integer,
        default=0,
        nullable=False
    )

    rescheduled = db.Column(
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

    assigned_user = db.relationship(
        "User",
        back_populates="assigned_tasks",
        foreign_keys=[assigned_to]
    )

    team = db.relationship(
        "Team",
        back_populates="tasks"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "assigned_to": self.assigned_to,
            "team_id": self.team_id,
            "deadline": self.deadline.isoformat(),
            "done": self.done,
            "completed_at": (
                self.completed_at.isoformat()
                if self.completed_at else None
            ),
            "priority": self.priority,
            "rescheduled": self.rescheduled,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "assigned_user": (
                {
                    "id": self.assigned_user.id,
                    "name": self.assigned_user.name,
                    "email": self.assigned_user.email,
                    "avatar": self.assigned_user.avatar
                }
                if self.assigned_user else None
            )
        }
