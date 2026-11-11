from datetime import datetime, timezone

from app.extensions import db


class Deadline(db.Model):

    __tablename__ = "deadlines"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(255),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    due_date = db.Column(
        db.DateTime(timezone=True),
        nullable=False
    )

    team_id = db.Column(
        db.Integer,
        db.ForeignKey("teams.id"),
        nullable=False
    )

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    team = db.relationship("Team")
    creator = db.relationship("User")

    def to_dict(self):

        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "due_date": self.due_date.isoformat(),
            "team_id": self.team_id,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat()
        }