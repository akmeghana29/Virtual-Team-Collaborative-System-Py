
import os
from datetime import timedelta
from sqlalchemy.engine import URL, make_url


class Config:

    # Application security
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    if not SECRET_KEY or not JWT_SECRET_KEY:
        raise RuntimeError(
            "SECRET_KEY and JWT_SECRET_KEY must be configured "
            "in the environment"
        )

    # PostgreSQL database connection
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        database_url = make_url(database_url)

        if database_url.drivername == "postgres":
            database_url = database_url.set(
                drivername="postgresql+psycopg2"
            )

        elif database_url.drivername == "postgresql":
            database_url = database_url.set(
                drivername="postgresql+psycopg2"
            )

        SQLALCHEMY_DATABASE_URI = database_url

    else:
        SQLALCHEMY_DATABASE_URI = URL.create(
            drivername="postgresql+psycopg2",
            username=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", ""),
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "5432")),
            database=os.getenv("DB_NAME", "vtcw_python_db")
        )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True
    }

    # JWT authentication
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_TYPE = "Bearer"

    # File upload configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
