# Data Model: Task Management

**Feature**: 002-task-crud
**Date**: 2026-01-17

## Entity Overview

```
┌─────────────────────────────────────────────────────┐
│                       Task                          │
├─────────────────────────────────────────────────────┤
│ id: int (PK, auto-increment)                       │
│ user_id: str (indexed, FK to auth user)            │
│ title: str (1-255 chars, required)                 │
│ description: str | null (optional, TEXT)           │
│ is_complete: bool (default: false)                 │
│ created_at: datetime (UTC, auto-set)               │
│ updated_at: datetime (UTC, auto-update)            │
└─────────────────────────────────────────────────────┘
```

## Task Entity

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique task identifier |
| `user_id` | VARCHAR(255) | NOT NULL, INDEX | Owner's ID from JWT claims |
| `title` | VARCHAR(255) | NOT NULL, MIN 1 char | Task title |
| `description` | TEXT | NULLABLE | Optional task description |
| `is_complete` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp (UTC) |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification (UTC) |

### Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `pk_task` | `id` | PRIMARY KEY | Unique identifier |
| `ix_task_user_id` | `user_id` | B-TREE | Fast lookup by owner |

### Validation Rules

| Rule | Condition | Error Response |
|------|-----------|----------------|
| Title required | `title IS NOT NULL AND length(title) >= 1` | 400: "Title is required" |
| Title max length | `length(title) <= 255` | 400: "Title must be 255 characters or less" |
| User ID immutable | Cannot change after creation | N/A (not exposed in update schema) |

### State Transitions

```
┌─────────────┐     toggle_complete()    ┌─────────────┐
│  Incomplete │ ◄──────────────────────► │  Complete   │
│ is_complete │                          │ is_complete │
│  = false    │                          │  = true     │
└─────────────┘                          └─────────────┘
```

## SQLModel Definition

```python
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    """
    Task entity for user todo items.

    Ownership: Each task belongs to exactly one user, identified by user_id
    from JWT claims. All queries MUST filter by user_id.
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None)
    is_complete: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## Request/Response Schemas

### TaskCreate (Request)

```python
from pydantic import BaseModel, field_validator


class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str
    description: Optional[str] = None

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError('Title is required')
        if len(v) > 255:
            raise ValueError('Title must be 255 characters or less')
        return v
```

### TaskUpdate (Request)

```python
class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""
    title: Optional[str] = None
    description: Optional[str] = None

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if not v:
            raise ValueError('Title cannot be empty')
        if len(v) > 255:
            raise ValueError('Title must be 255 characters or less')
        return v
```

### TaskResponse (Response)

```python
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
```

### TaskListResponse (Response)

```python
class TaskListResponse(BaseModel):
    """Schema for list of tasks response."""
    tasks: list[TaskResponse]
    count: int
```

## Database Migration

### Initial Schema (SQL)

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_task_user_id ON tasks (user_id);
```

### SQLModel Auto-Creation

```python
from sqlmodel import SQLModel, create_engine

def init_db(engine):
    """Create all tables. Safe to call multiple times."""
    SQLModel.metadata.create_all(engine)
```

## Relationships

### User → Task (One-to-Many)

- One user can have many tasks
- Each task belongs to exactly one user
- Relationship is implicit (no FK constraint to user table)
- User table is managed by Spec-1 (Better Auth)

**Note**: No explicit foreign key to user table because:
1. User management is handled by Better Auth (Spec-1)
2. User ID is derived from JWT, not database lookup
3. Simpler architecture with decoupled services

## Query Patterns

### List Tasks (Ownership Filtered)

```python
def list_tasks(session: Session, user_id: str) -> list[Task]:
    statement = select(Task).where(Task.user_id == user_id)
    return session.exec(statement).all()
```

### Get Single Task (Ownership Filtered)

```python
def get_task(session: Session, user_id: str, task_id: int) -> Task | None:
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id
    )
    return session.exec(statement).first()
```

### Create Task

```python
def create_task(session: Session, user_id: str, data: TaskCreate) -> Task:
    task = Task(
        user_id=user_id,
        title=data.title,
        description=data.description
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

### Update Task

```python
def update_task(
    session: Session,
    user_id: str,
    task_id: int,
    data: TaskUpdate
) -> Task | None:
    task = get_task(session, user_id, task_id)
    if not task:
        return None

    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

### Delete Task

```python
def delete_task(session: Session, user_id: str, task_id: int) -> bool:
    task = get_task(session, user_id, task_id)
    if not task:
        return False

    session.delete(task)
    session.commit()
    return True
```

### Toggle Completion

```python
def toggle_complete(session: Session, user_id: str, task_id: int) -> Task | None:
    task = get_task(session, user_id, task_id)
    if not task:
        return None

    task.is_complete = not task.is_complete
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```
