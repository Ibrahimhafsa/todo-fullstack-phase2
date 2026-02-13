"""Security utilities for password hashing and JWT operations."""
from datetime import datetime, timedelta
from typing import Any

import bcrypt
from jose import JWTError, jwt

from app.core.config import get_settings

settings = get_settings()


def hash_password(password: str) -> str:
    """Hash a password using bcrypt.

    Per research.md Section 3.

    Note: Bcrypt has a 72-byte limit; passwords are truncated.
    """
    # Bcrypt has a 72-byte limit for passwords
    truncated = password[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(truncated.encode('utf-8'), salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash.

    Per research.md Section 3.

    Note: Bcrypt has a 72-byte limit; passwords are truncated.
    """
    # Bcrypt has a 72-byte limit for passwords
    truncated = plain_password[:72]
    return bcrypt.checkpw(truncated.encode('utf-8'), hashed_password.encode('utf-8'))


def create_access_token(user_id: int, expires_delta: timedelta | None = None) -> str:
    """Create a JWT access token.

    Per FR-004, FR-005, research.md Section 2.

    Args:
        user_id: The user ID to encode in the token
        expires_delta: Optional custom expiration time

    Returns:
        Encoded JWT token string
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.access_token_expire_days)

    to_encode: dict[str, Any] = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access",
    }

    encoded_jwt = jwt.encode(
        to_encode,
        settings.better_auth_secret,
        algorithm=settings.algorithm,
    )
    return encoded_jwt


def verify_token(token: str) -> dict[str, Any] | None:
    """Verify and decode a JWT token.

    Per FR-006, research.md Section 2.

    Args:
        token: The JWT token to verify

    Returns:
        Decoded payload if valid, None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=[settings.algorithm],
        )
        return payload
    except JWTError:
        return None
