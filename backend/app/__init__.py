
import os

from dotenv import load_dotenv
from flask import Flask

load_dotenv()

from app.config import Config
from app.extensions import db, migrate, jwt, bcrypt, cors

# Import database models
from app.models import Team, User, Task, Resource, Standup, Deadline

# Import API routes
from app.routes.auth import auth_bp
from app.routes.tasks import tasks_bp
from app.routes.resources import resources_bp
from app.routes.teams import teams_bp
from app.routes.standups import standups_bp
from app.routes.deadlines import deadlines_bp
from app.routes.members import members_bp


def create_app():

    app = Flask(__name__)

    # Load application configuration
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Configure CORS
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]

    frontend_url = os.getenv("FRONTEND_URL")

    if frontend_url:
        allowed_origins.append(frontend_url.rstrip("/"))

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": allowed_origins,
                "methods": ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"]
            }
        }
    )

    # Application-wide security headers
    @app.after_request
    def add_security_headers(response):

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=()"
        )
        response.headers["Content-Security-Policy"] = (
            "default-src 'none'; "
            "frame-ancestors 'none'; "
            "base-uri 'none'"
        )

        # Enable HSTS only in production over HTTPS
        if (
            os.getenv("FLASK_ENV") == "production"
            and request_is_https(response)
        ):
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains"
            )

        return response

    # Register API blueprints
    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    app.register_blueprint(
        tasks_bp,
        url_prefix="/api/tasks"
    )

    app.register_blueprint(
        resources_bp,
        url_prefix="/api/resources"
    )

    app.register_blueprint(
        teams_bp,
        url_prefix="/api/teams"
    )

    app.register_blueprint(
        standups_bp,
        url_prefix="/api/standups"
    )

    app.register_blueprint(
        deadlines_bp,
        url_prefix="/api/deadlines"
    )

    app.register_blueprint(
        members_bp,
        url_prefix="/api/members"
    )

    # Basic health checks
    @app.route("/")
    def home():
        return {
            "message": "Virtual Team Collaborative Workspace API is running"
        }

    @app.route("/health")
    def health():
        return {
            "status": "ok",
            "message": "Flask backend is healthy"
        }

    return app


def request_is_https(response):
    return response.headers.get("X-Forwarded-Proto") == "https"
