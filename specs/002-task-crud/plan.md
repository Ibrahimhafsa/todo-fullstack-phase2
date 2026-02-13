# Implementation Plan: Task Management (CRUD + Ownership)

**Branch**: `002-task-crud` | **Date**: 2026-01-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-task-crud/spec.md`
**Constitution**: v1.1.0 (Principles VII-X govern this feature)

## Summary

Implement a complete Task Management API with CRUD operations and user ownership enforcement. The backend exposes REST endpoints under `/api/{user_id}/tasks` using FastAPI with SQLModel ORM, persisting to Neon PostgreSQL. All endpoints require JWT authentication, with user identity extracted exclusively from JWT claims. Ownership is enforced by filtering all database queries by the authenticated user's ID, never trusting URL path parameters alone.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, SQLModel, PyJWT, python-dotenv
**Storage**: Neon Serverless PostgreSQL (via `DATABASE_URL` env var)
**Testing**: pytest, httpx (for async API testing)
**Target Platform**: Linux server (containerized deployment)
**Project Type**: Web application (backend only for this spec)
**Performance Goals**: <2 seconds for all CRUD operations, <1 second for list/toggle
**Constraints**: <200ms p95 latency, stateless API (JWT auth)
**Scale/Scope**: 100 concurrent authenticated users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. JWT-Only Auth | All endpoints require JWT in Authorization header | ✅ PASS |
| II. Shared Secret | BETTER_AUTH_SECRET from env, ≥32 chars | ✅ PASS |
| III. Trust Boundary | User ID from JWT only, never from request body/URL | ✅ PASS |
| IV. Protected Routes | All task endpoints require valid JWT | ✅ PASS |
| V. Auth Failure Handling | Generic error messages, no user enumeration | ✅ PASS |
| VI. SDD Mandate | Following Constitution → Spec → Plan → Tasks flow | ✅ PASS |
| VII. Ownership Enforcement | All queries filtered by JWT user ID | ✅ PASS |
| VIII. Data Persistence | Neon PostgreSQL, no in-memory storage | ✅ PASS |
| IX. API Contract | 6 endpoints implemented per spec | ✅ PASS |
| X. Error Standards | Consistent HTTP status codes and JSON errors | ✅ PASS |

**Gate Status**: ✅ ALL PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-task-crud/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI)
│   └── tasks-api.yaml
├── checklists/          # Quality checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment configuration
│   ├── database.py          # Neon PostgreSQL connection
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task SQLModel
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── task.py          # Pydantic request/response schemas
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py  # CRUD business logic
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies (auth, db session)
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── tasks.py     # Task API endpoints
│   └── auth/
│       ├── __init__.py
│       └── jwt.py           # JWT verification (uses Spec-1 auth)
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # pytest fixtures
│   ├── test_tasks_api.py    # API integration tests
│   └── test_task_service.py # Unit tests
├── requirements.txt
├── .env.example
└── README.md
```

**Structure Decision**: Web application structure with `backend/` directory. Frontend exists separately (managed by Spec-3). This plan focuses exclusively on the Python backend API implementation.

## Complexity Tracking

No constitution violations requiring justification. Design follows minimal complexity approach:
- Single Task model (no complex inheritance)
- Direct service layer (no repository pattern abstraction)
- Standard FastAPI dependency injection for auth

## Component Architecture

### 1. Database Connection Module

```python
# backend/app/database.py
- Load DATABASE_URL from environment
- Create SQLModel engine with Neon PostgreSQL connection string
- Provide get_session() dependency for request-scoped sessions
- Handle connection pooling for serverless environment
```

### 2. Task Model (SQLModel)

```python
# backend/app/models/task.py
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # From JWT, immutable
    title: str = Field(max_length=255)
    description: str | None = Field(default=None)
    is_complete: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 3. Request/Response Schemas

```python
# backend/app/schemas/task.py
class TaskCreate(BaseModel):
    title: str  # Required, 1-255 chars
    description: str | None = None

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None

class TaskResponse(BaseModel):
    id: int
    user_id: str
    title: str
    description: str | None
    is_complete: bool
    created_at: datetime
    updated_at: datetime
```

### 4. CRUD Service Layer

```python
# backend/app/services/task_service.py
def create_task(session, user_id, data: TaskCreate) -> Task
def list_tasks(session, user_id) -> list[Task]
def get_task(session, user_id, task_id) -> Task | None
def update_task(session, user_id, task_id, data: TaskUpdate) -> Task | None
def delete_task(session, user_id, task_id) -> bool
def toggle_complete(session, user_id, task_id) -> Task | None
```

### 5. API Routes

```python
# backend/app/api/routes/tasks.py
# All routes require: Depends(get_current_user)
# All routes enforce: user_id == current_user.id

GET    /api/{user_id}/tasks              → list_tasks()
POST   /api/{user_id}/tasks              → create_task()
GET    /api/{user_id}/tasks/{task_id}    → get_task()
PUT    /api/{user_id}/tasks/{task_id}    → update_task()
DELETE /api/{user_id}/tasks/{task_id}    → delete_task()
PATCH  /api/{user_id}/tasks/{task_id}/complete → toggle_complete()
```

### 6. Auth Dependency

```python
# backend/app/api/deps.py
def get_current_user(
    authorization: str = Header(...),
    session: Session = Depends(get_session)
) -> User:
    # Extract Bearer token
    # Verify JWT signature using BETTER_AUTH_SECRET
    # Extract user_id from claims
    # Return user object (or raise HTTPException 401)
```

### 7. Ownership Enforcement Strategy

```python
# In every route handler:
def get_task(user_id: str, task_id: int, current_user = Depends(get_current_user)):
    # Step 1: Verify path user_id matches JWT user_id
    if user_id != current_user.id:
        raise HTTPException(404, "Task not found")

    # Step 2: Query with authenticated user_id filter
    task = task_service.get_task(session, current_user.id, task_id)

    # Step 3: Return 404 if not found (don't reveal existence)
    if not task:
        raise HTTPException(404, "Task not found")

    return task
```

## Error Handling Strategy

| Scenario | HTTP Status | Response Body |
|----------|-------------|---------------|
| Missing Authorization header | 401 | `{"detail": "Not authenticated"}` |
| Invalid/expired JWT | 401 | `{"detail": "Invalid token"}` |
| Path user_id mismatch | 404 | `{"detail": "Task not found"}` |
| Task not found | 404 | `{"detail": "Task not found"}` |
| Empty title | 400 | `{"detail": "Title is required"}` |
| Title too long | 400 | `{"detail": "Title must be 255 characters or less"}` |
| Invalid task ID format | 400 | `{"detail": "Invalid task ID"}` |
| Server error | 500 | `{"detail": "Internal server error"}` |

## Dependencies

### Python Packages (requirements.txt)

```text
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlmodel>=0.0.14
psycopg2-binary>=2.9.9
pyjwt>=2.8.0
python-dotenv>=1.0.0
httpx>=0.26.0  # For testing
pytest>=8.0.0
pytest-asyncio>=0.23.0
```

### Environment Variables

```text
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
BETTER_AUTH_SECRET=<32+ character secret matching frontend>
```

## Testing Strategy

### Manual Verification Plan

1. **Create 2 test users** via Spec-1 auth system
2. **User A creates tasks**: Verify tasks are created with user A's ID
3. **User A lists tasks**: Verify only user A's tasks returned
4. **User B attempts to access User A's task**: Verify 404 returned
5. **Missing token test**: Verify 401 for requests without Authorization header
6. **Invalid token test**: Verify 401 for malformed/expired tokens
7. **CRUD end-to-end**: Create → Read → Update → Toggle → Delete → Verify deletion
8. **Server restart**: Restart backend, verify tasks persist

### Automated Tests

```python
# tests/test_tasks_api.py
- test_create_task_success
- test_create_task_empty_title_fails
- test_list_tasks_returns_only_owned
- test_get_task_not_owned_returns_404
- test_update_task_success
- test_delete_task_success
- test_toggle_complete_success
- test_unauthenticated_request_returns_401
- test_invalid_token_returns_401
```

## Non-Goals (Explicitly Out of Scope)

- No frontend UI work (Spec-3)
- No styling work (Spec-3)
- No auth configuration changes (Spec-1 complete)
- No advanced features:
  - Task priorities/tags
  - Search/filter/sort
  - Due dates/reminders
  - Recurring tasks
  - Pagination
