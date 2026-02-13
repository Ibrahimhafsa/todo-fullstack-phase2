"""Request/Response schemas for Task API."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str
    description: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        """Validate title is non-empty and max 255 chars (FR-008)."""
        v = v.strip()
        if not v:
            raise ValueError("Title is required")
        if len(v) > 255:
            raise ValueError("Title must be 255 characters or less")
        return v


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""
    title: Optional[str] = None
    description: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        """Validate title if provided."""
        if v is None:
            return v
        v = v.strip()
        if not v:
            raise ValueError("Title cannot be empty")
        if len(v) > 255:
            raise ValueError("Title must be 255 characters or less")
        return v


class TaskResponse(BaseModel):
    """Schema for task responses."""
    id: int
    user_id: str
    title: str
    description: Optional[str]
    is_complete: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    """Schema for list of tasks response."""
    tasks: list[TaskResponse]
    count: int
