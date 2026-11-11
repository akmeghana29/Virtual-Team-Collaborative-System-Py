from datetime import datetime, timezone

from app.extensions import db


class Standup(db.Model):

    __tablename__ = "standups"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    team_id = db.Column(
        db.Integer,
        db.ForeignKey("teams.id"),
        nullable=False
    )

    yesterday = db.Column(
        db.Text,
        nullable=False
    )

    today = db.Column(
        db.Text,
        nullable=False
    )

    blockers = db.Column(
        db.Text,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    user = db.relationship("User")
    team = db.relationship("Team")

    def to_dict(self):

        return {
            "id": self.id,
            "user_id": self.user_id,
            "team_id": self.team_id,
            "yesterday": self.yesterday,
            "today": self.today,
            "blockers": self.blockers,
            "created_at": self.created_at.isoformat()
        }