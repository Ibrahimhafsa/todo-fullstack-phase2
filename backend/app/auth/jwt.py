"""JWT verification module for Better Auth tokens.

Verifies JWT tokens signed by Better Auth using JWKS (JSON Web Key Set).
Better Auth uses EdDSA asymmetric signing, so we fetch public keys from JWKS endpoint.
"""
import logging
from dataclasses import dataclass
from functools import lru_cache
from typing import Any

import httpx
import jwt
from fastapi import HTTPException, status
from jwt import PyJWKClient

from app.config import settings

logger = logging.getLogger(__name__)


@dataclass
class User:
    """Authenticated user extracted from JWT."""
    id: str


# Cache the JWKS client to avoid repeated network requests
_jwks_client: PyJWKClient | None = None


def get_jwks_client() -> PyJWKClient:
    """Get cached JWKS client for token verification."""
    global _jwks_client
    if _jwks_client is None:
        jwks_url = f"{settings.BETTER_AUTH_URL}/api/auth/jwks"
        logger.info(f"Initializing JWKS client with URL: {jwks_url}")
        _jwks_client = PyJWKClient(jwks_url, cache_keys=True, lifespan=3600)
    return _jwks_client


def verify_jwt(token: str) -> User:
    """
    Verify JWT token and extract user identity.

    Constitution I: JWT-only authentication
    Constitution III: User ID from JWT claims only

    Better Auth signs JWTs with EdDSA using asymmetric keys.
    Public keys are fetched from the JWKS endpoint.

    Args:
        token: JWT token string (without 'Bearer ' prefix)

    Returns:
        User object with id from JWT claims

    Raises:
        HTTPException 401: If token is invalid or expired
    """
    try:
        # Get the signing key from JWKS
        jwks_client = get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        # Decode and verify the token
        payload: dict[str, Any] = jwt.decode(
            token,
            signing_key.key,
            algorithms=["EdDSA", "ES256", "RS256"],  # Support multiple algorithms
            audience=settings.BETTER_AUTH_URL,
            issuer=settings.BETTER_AUTH_URL,
            options={"verify_aud": False, "verify_iss": False}  # Relax for dev
        )

        # Extract user_id from 'sub' claim (standard JWT claim for subject)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject claim"
            )
        return User(id=user_id)

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except httpx.RequestError as e:
        logger.error(f"Failed to fetch JWKS: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable"
        )
