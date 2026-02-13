"""Authentication API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.deps import get_current_user, get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import AuthResponse, UserCreate, UserLogin, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)) -> AuthResponse:
    """Register a new user account.

    Per FR-001, FR-002, FR-009, auth-api.yaml /api/auth/signup.

    Returns generic error for duplicate emails (no enumeration).
    """
    # Check if email already exists
    existing_user = db.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        # Generic error per FR-009 - no email enumeration
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Registration failed",
        )

    # Create new user
    hashed = hash_password(user_data.password)
    user = User(email=user_data.email, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate JWT token
    token = create_access_token(user.id)

    return AuthResponse(user=UserResponse.model_validate(user), token=token)


@router.post("/signin", response_model=AuthResponse)
def signin(credentials: UserLogin, db: Session = Depends(get_db)) -> AuthResponse:
    """Sign in an existing user.

    Per FR-003, FR-009, auth-api.yaml /api/auth/signin.

    Returns generic error for invalid credentials (no enumeration).
    """
    # Find user by email
    user = db.exec(select(User).where(User.email == credentials.email)).first()

    # Verify user exists and password matches
    if not user or not verify_password(credentials.password, user.hashed_password):
        # Generic error per FR-009 - no credential enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
        )

    # Generate JWT token
    token = create_access_token(user.id)

    return AuthResponse(user=UserResponse.model_validate(user), token=token)


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserResponse:
    """Get current authenticated user information.

    Per FR-007, auth-api.yaml /api/auth/me.
    """
    user = db.get(User, current_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return UserResponse.model_validate(user)


@router.get("/verify")
def verify_token_endpoint(
    current_user_id: int = Depends(get_current_user),
) -> dict:
    """Verify JWT token validity.

    Per auth-api.yaml /api/auth/verify.
    """
    return {"valid": True, "user_id": current_user_id}
