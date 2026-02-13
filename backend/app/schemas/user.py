"""Pydantic schemas for user authentication."""
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Schema for user registration request."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    """Schema for user login request."""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user data in responses (no password)."""

    id: int
    email: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """Schema for token-only response."""

    access_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    """Schema for authentication response with user and token."""

    user: UserResponse
    token: str
