
from datetime import timedelta

from flask_jwt_extended import create_access_token


def generate_token(user):
    """
    Generate a JWT access token for an authenticated user.
    """

    additional_claims = {
        "email": user.email
    }

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims=additional_claims,
        expires_delta=timedelta(hours=1)
    )

    return access_token
