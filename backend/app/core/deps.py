"""FastAPI dependencies for authentication and database."""
from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, create_engine

from app.core.config import get_settings
from app.core.security import verify_token

settings = get_settings()

# Database engine
engine = create_engine(settings.database_url, echo=False)

# OAuth2 scheme for extracting bearer token from Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin")


def get_db() -> Generator[Session, None, None]:
    """Get database session dependency."""
    with Session(engine) as session:
        yield session


def get_current_user(token: str = Depends(oauth2_scheme)) -> int:
    """Extract and validate user ID from JWT token.

    Per FR-007, FR-008, research.md Section 2.

    Returns generic 401 for all auth failures (no enumeration).
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Verify token
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception

    # Extract user ID from 'sub' claim
    user_id_str = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception

    try:
        user_id = int(user_id_str)
    except ValueError:
        raise credentials_exception

    return user_id
