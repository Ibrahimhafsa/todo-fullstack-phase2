"""FastAPI dependencies for authentication and database sessions."""
from typing import Optional

from fastapi import Depends, Header, HTTPException, status
from sqlmodel import Session

from app.core.security import verify_token
from app.database import get_session as _get_session


# Re-export get_session for convenient imports
get_session = _get_session


class User:
    """Authenticated user from JWT token."""
    def __init__(self, id: str):
        self.id = id


def get_current_user(
    authorization: Optional[str] = Header(default=None)
) -> User:
    """
    Extract and verify current user from JWT token (HS256 format).

    Constitution IV: All routes require valid JWT
    FR-001: JWT in Authorization header
    FR-002: 401 for missing/invalid JWT

    Args:
        authorization: Authorization header value (Bearer <token>)

    Returns:
        User object with authenticated user's ID

    Raises:
        HTTPException 401: If authorization missing or invalid
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    # Extract Bearer token
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )

    token = parts[1]

    # Verify JWT token using HS256
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # Extract user ID from 'sub' claim
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing subject claim"
        )

    return User(id=str(user_id))
