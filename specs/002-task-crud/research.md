# Research: Task Management (CRUD + Ownership)

**Feature**: 002-task-crud
**Date**: 2026-01-17
**Status**: Complete

## Overview

This document captures research decisions for implementing the Task Management API. All technical context items from the plan have been resolved with no remaining NEEDS CLARIFICATION items.

## Research Findings

### 1. SQLModel for FastAPI + PostgreSQL

**Decision**: Use SQLModel as the ORM layer

**Rationale**:
- Native integration with FastAPI and Pydantic
- Single model definition serves as both database table and API schema
- Type-safe queries with Python type hints
- Constitution mandates SQLModel (Principle VIII)

**Alternatives Considered**:
- SQLAlchemy alone: More verbose, requires separate Pydantic schemas
- Django ORM: Would require Django framework, not FastAPI
- Raw SQL: No ORM benefits, more error-prone

### 2. Neon PostgreSQL Connection Strategy

**Decision**: Use connection pooling with `pool_pre_ping=True` for serverless resilience

**Rationale**:
- Neon is serverless PostgreSQL; connections may be recycled
- `pool_pre_ping` detects stale connections before query execution
- SSL mode `require` enforced for secure connections
- Connection string from `DATABASE_URL` environment variable

**Best Practices Applied**:
```python
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Disable SQL logging in production
    pool_pre_ping=True,  # Check connections before use
    pool_size=5,  # Reasonable pool size for serverless
    max_overflow=10  # Allow burst connections
)
```

### 3. JWT Verification Strategy

**Decision**: Use PyJWT with HS256 algorithm matching Better Auth

**Rationale**:
- Better Auth (frontend) uses HS256 symmetric signing by default
- Shared secret (`BETTER_AUTH_SECRET`) enables verification
- Constitution Principle I mandates JWT-only authentication

**Implementation Pattern**:
```python
import jwt
from app.config import settings

def verify_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
```

### 4. User ID Field Type

**Decision**: Store `user_id` as `str` (not UUID or int)

**Rationale**:
- Better Auth generates string-based user IDs
- Flexibility to support various ID formats
- Constitution doesn't mandate specific ID type
- String comparison is straightforward for ownership checks

### 5. Ownership Enforcement Pattern

**Decision**: Double-check pattern (path validation + query filter)

**Rationale**:
- Path parameter `{user_id}` provides URL structure for REST conventions
- JWT-derived user ID is the authoritative source
- Always filter queries by authenticated user ID
- Return 404 (not 403) for non-owned resources to prevent enumeration

**Pattern**:
```python
# Step 1: Path validation (early exit)
if path_user_id != current_user.id:
    raise HTTPException(404, "Task not found")

# Step 2: Query with ownership filter (defense in depth)
task = session.exec(
    select(Task).where(
        Task.id == task_id,
        Task.user_id == current_user.id  # Always filter!
    )
).first()
```

### 6. Timestamp Handling

**Decision**: Use `datetime.utcnow()` with automatic `updated_at` refresh

**Rationale**:
- UTC timestamps avoid timezone confusion
- `created_at` set once at creation
- `updated_at` refreshed on every modification
- Stored without timezone info (timezone-naive UTC)

**Implementation**:
```python
from datetime import datetime

class Task(SQLModel, table=True):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# On update:
task.updated_at = datetime.utcnow()
```

### 7. Error Response Format

**Decision**: Use FastAPI's default HTTPException JSON format

**Rationale**:
- Consistent with FastAPI conventions
- Constitution Principle X specifies `detail` field
- Automatic OpenAPI documentation

**Format**:
```json
{
    "detail": "Human-readable error message"
}
```

### 8. Title Validation Strategy

**Decision**: Use Pydantic validators with clear error messages

**Rationale**:
- Pydantic validation happens before handler execution
- Automatic 422 response for validation failures
- Custom validators for business rules (min 1, max 255 chars)

**Implementation**:
```python
from pydantic import field_validator

class TaskCreate(BaseModel):
    title: str

    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError('Title is required')
        if len(v) > 255:
            raise ValueError('Title must be 255 characters or less')
        return v
```

## Dependencies Resolved

| Dependency | Version | Purpose |
|------------|---------|---------|
| fastapi | >=0.109.0 | Web framework |
| uvicorn[standard] | >=0.27.0 | ASGI server |
| sqlmodel | >=0.0.14 | ORM layer |
| psycopg2-binary | >=2.9.9 | PostgreSQL driver |
| pyjwt | >=2.8.0 | JWT verification |
| python-dotenv | >=1.0.0 | Environment loading |
| httpx | >=0.26.0 | Testing HTTP client |
| pytest | >=8.0.0 | Test framework |
| pytest-asyncio | >=0.23.0 | Async test support |

## Integration Points

### With Spec-1 (Authentication)

- JWT tokens issued by Better Auth (frontend)
- Backend validates using shared `BETTER_AUTH_SECRET`
- User ID extracted from JWT `sub` claim
- No changes required to Spec-1 implementation

### With Neon PostgreSQL

- Connection via `DATABASE_URL` environment variable
- SSL mode `require` for secure connections
- Automatic table creation via SQLModel `create_all()`

## Open Questions Resolved

| Question | Resolution |
|----------|------------|
| How to handle concurrent task updates? | Last write wins (no optimistic locking for MVP) |
| Should description have max length? | No limit (TEXT field), frontend can truncate display |
| What if user_id in JWT doesn't exist in DB? | Task created with that user_id; no user table dependency |

## Conclusion

All research items resolved. No NEEDS CLARIFICATION markers remain. Proceed to Phase 1: Data Model and Contracts.
