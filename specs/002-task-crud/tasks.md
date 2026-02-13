# Tasks: Task Management (CRUD + Ownership)

**Input**: Design documents from `/specs/002-task-crud/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/tasks-api.yaml
**Branch**: `002-task-crud`
**Date**: 2026-01-17

**Tests**: Not explicitly requested - manual verification checklist included in final phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/` for source, `backend/tests/` for tests
- Paths follow plan.md structure

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create FastAPI project structure and install dependencies

- [x] T001 Create backend directory structure per plan.md at `backend/app/`
  - **Inputs**: plan.md project structure
  - **Output**: Directory tree with `__init__.py` files
  - **Spec Ref**: Plan - Project Structure
  - **Steps**:
    1. Create `backend/app/` directory
    2. Create subdirectories: `models/`, `schemas/`, `services/`, `api/`, `api/routes/`, `auth/`
    3. Create `__init__.py` in each directory
    4. Create `backend/tests/` directory with `__init__.py`
  - **Completion**: All directories exist with empty `__init__.py` files

- [x] T002 [P] Create requirements.txt with dependencies at `backend/requirements.txt`
  - **Inputs**: plan.md dependencies section
  - **Output**: requirements.txt with all packages
  - **Spec Ref**: Plan - Dependencies
  - **Steps**:
    1. Create file with: fastapi>=0.109.0, uvicorn[standard]>=0.27.0, sqlmodel>=0.0.14, psycopg2-binary>=2.9.9, pyjwt>=2.8.0, python-dotenv>=1.0.0, httpx>=0.26.0, pytest>=8.0.0, pytest-asyncio>=0.23.0
  - **Completion**: File exists with all 9 dependencies listed

- [x] T003 [P] Create .env.example with required variables at `backend/.env.example`
  - **Inputs**: plan.md environment variables
  - **Output**: .env.example template
  - **Spec Ref**: Plan - Environment Variables
  - **Steps**:
    1. Create file with DATABASE_URL and BETTER_AUTH_SECRET placeholders
    2. Include comments explaining each variable
  - **Completion**: File exists with both variables documented

- [x] T004 Create environment configuration module at `backend/app/config.py`
  - **Inputs**: .env.example variables
  - **Output**: Pydantic Settings class
  - **Spec Ref**: Constitution II (Shared Secret), Plan - Config
  - **Steps**:
    1. Import BaseSettings from pydantic_settings
    2. Create Settings class with DATABASE_URL and BETTER_AUTH_SECRET fields
    3. Add validation for BETTER_AUTH_SECRET minimum 32 chars
    4. Export settings singleton
  - **Completion**: `from app.config import settings` works and loads env vars

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Implement database connection module at `backend/app/database.py`
  - **Inputs**: config.py, research.md connection strategy
  - **Output**: SQLModel engine and get_session dependency
  - **Spec Ref**: FR-020, FR-021 (Data Persistence), Constitution VIII
  - **Steps**:
    1. Import create_engine from sqlmodel, settings from config
    2. Create engine with DATABASE_URL, pool_pre_ping=True, pool_size=5
    3. Create get_session() generator function for FastAPI Depends
    4. Create init_db() function to create all tables
  - **Completion**: Database connection works, tables can be created

- [x] T006 [P] Create Task SQLModel at `backend/app/models/task.py`
  - **Inputs**: data-model.md Task entity
  - **Output**: Task SQLModel class
  - **Spec Ref**: Key Entities, FR-011 (timestamps)
  - **Steps**:
    1. Import SQLModel, Field, datetime
    2. Create Task class with table=True
    3. Define fields: id (PK), user_id (indexed), title (max 255), description (optional), is_complete (default False), created_at, updated_at
    4. Set __tablename__ = "tasks"
  - **Completion**: Task model imports correctly, has all 7 fields

- [x] T007 [P] Create request/response schemas at `backend/app/schemas/task.py`
  - **Inputs**: data-model.md schemas, contracts/tasks-api.yaml
  - **Output**: TaskCreate, TaskUpdate, TaskResponse, TaskListResponse classes
  - **Spec Ref**: FR-008 (title validation)
  - **Steps**:
    1. Create TaskCreate with title (required) and description (optional)
    2. Add field_validator for title: strip, check non-empty, max 255 chars
    3. Create TaskUpdate with optional title and description
    4. Add field_validator for title (same rules, but allow None)
    5. Create TaskResponse with all Task fields + from_attributes config
    6. Create TaskListResponse with tasks list and count
  - **Completion**: All 4 schema classes import correctly with validation

- [x] T008 Implement JWT verification at `backend/app/auth/jwt.py`
  - **Inputs**: config.py BETTER_AUTH_SECRET, research.md JWT strategy
  - **Output**: verify_jwt() function, User dataclass
  - **Spec Ref**: FR-001, FR-002, FR-003, Constitution I, III
  - **Steps**:
    1. Import jwt (PyJWT), settings
    2. Create User dataclass with id field
    3. Create verify_jwt(token: str) function
    4. Decode JWT with HS256 algorithm using BETTER_AUTH_SECRET
    5. Extract user_id from 'sub' claim
    6. Return User object with id
    7. Handle ExpiredSignatureError and InvalidTokenError with HTTPException 401
  - **Completion**: Function verifies valid JWTs, rejects invalid ones

- [x] T009 Implement auth dependency at `backend/app/api/deps.py`
  - **Inputs**: jwt.py verify_jwt, database.py get_session
  - **Output**: get_current_user dependency, get_session re-export
  - **Spec Ref**: FR-001, FR-002, Constitution IV
  - **Steps**:
    1. Import Header from fastapi, verify_jwt from auth.jwt
    2. Create get_current_user(authorization: str = Header(...)) function
    3. Extract Bearer token from authorization header
    4. Call verify_jwt and return User object
    5. Raise HTTPException 401 if header missing or malformed
    6. Re-export get_session from database
  - **Completion**: Dependency extracts user from JWT, rejects missing/invalid auth

- [x] T010 Create FastAPI app entry point at `backend/app/main.py`
  - **Inputs**: database.py init_db
  - **Output**: FastAPI app with lifespan, health endpoint
  - **Spec Ref**: Plan - Main entry point
  - **Steps**:
    1. Import FastAPI, database.init_db
    2. Create lifespan context manager that calls init_db on startup
    3. Create FastAPI app with lifespan
    4. Add /health endpoint returning {"status": "ok"}
    5. Add placeholder for router inclusion
  - **Completion**: `uvicorn app.main:app` starts server, /health returns 200

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Create Task (Priority: P1)

**Goal**: Authenticated users can create tasks with title and optional description

**Independent Test**: Create task with valid JWT, verify 201 response with task details

**Spec Ref**: US1 - Create Task, FR-007 through FR-011

### Implementation for User Story 1

- [x] T011 [US1] Implement create_task service function at `backend/app/services/task_service.py`
  - **Inputs**: Task model, TaskCreate schema
  - **Output**: create_task(session, user_id, data) -> Task
  - **Spec Ref**: FR-007, FR-009, FR-010, FR-011
  - **Steps**:
    1. Create task_service.py file
    2. Import Session, Task, TaskCreate
    3. Implement create_task function:
       - Create Task instance with user_id from param (not request!)
       - Set title, description from data
       - is_complete defaults to False
       - timestamps auto-set by model
       - session.add(), session.commit(), session.refresh()
       - Return task
  - **Completion**: Function creates task in DB with correct user_id

- [x] T012 [US1] Implement POST /api/{user_id}/tasks endpoint at `backend/app/api/routes/tasks.py`
  - **Inputs**: deps.py, task_service.py, schemas
  - **Output**: create_task route returning 201
  - **Spec Ref**: US1 acceptance scenarios, FR-007, Constitution VII
  - **Steps**:
    1. Create tasks.py router file
    2. Import APIRouter, Depends, HTTPException, status
    3. Import get_current_user, get_session from deps
    4. Import TaskCreate, TaskResponse from schemas
    5. Import create_task from services
    6. Create router = APIRouter(prefix="/api", tags=["tasks"])
    7. Implement POST "/{user_id}/tasks" endpoint:
       - Depends on get_current_user, get_session
       - Validate path user_id == current_user.id (return 404 if not)
       - Call create_task service
       - Return TaskResponse with status_code=201
  - **Completion**: POST creates task, returns 201 with task JSON

- [x] T013 [US1] Register tasks router in main.py at `backend/app/main.py`
  - **Inputs**: tasks.py router
  - **Output**: Router mounted on app
  - **Spec Ref**: Plan - API Routes
  - **Steps**:
    1. Import router from api.routes.tasks
    2. Add app.include_router(router) after app creation
  - **Completion**: POST /api/{user_id}/tasks endpoint accessible

- [x] T014 [US1] Add create task error handling for validation at `backend/app/api/routes/tasks.py`
  - **Inputs**: TaskCreate validation errors
  - **Output**: 400 responses for invalid title
  - **Spec Ref**: US1 scenario 3, FR-008, FR-022
  - **Steps**:
    1. Pydantic validation already handles empty/long title
    2. Add exception handler if needed for custom error format
    3. Verify 400 returned for empty title, title > 255 chars
  - **Completion**: Empty title returns 400 "Title is required"

**Checkpoint**: User Story 1 complete - can create tasks

---

## Phase 4: User Story 2 - View Task List (Priority: P1)

**Goal**: Authenticated users can view all their tasks with completion status

**Independent Test**: List tasks, verify only user's tasks returned with is_complete field

**Spec Ref**: US2 - View Task List, FR-012, FR-014

### Implementation for User Story 2

- [x] T015 [US2] Implement list_tasks service function at `backend/app/services/task_service.py`
  - **Inputs**: Task model, Session
  - **Output**: list_tasks(session, user_id) -> list[Task]
  - **Spec Ref**: FR-012, FR-004, Constitution VII
  - **Steps**:
    1. Import select from sqlmodel
    2. Implement list_tasks function:
       - Create select(Task).where(Task.user_id == user_id)
       - Execute and return all results
  - **Completion**: Function returns only tasks for given user_id

- [x] T016 [US2] Implement GET /api/{user_id}/tasks endpoint at `backend/app/api/routes/tasks.py`
  - **Inputs**: deps.py, task_service.py, TaskListResponse schema
  - **Output**: list_tasks route returning 200
  - **Spec Ref**: US2 acceptance scenarios, FR-012, FR-014
  - **Steps**:
    1. Import TaskListResponse
    2. Implement GET "/{user_id}/tasks" endpoint:
       - Depends on get_current_user, get_session
       - Validate path user_id == current_user.id (return 404 if not)
       - Call list_tasks service
       - Return TaskListResponse with tasks and count
  - **Completion**: GET returns list of user's tasks with count

**Checkpoint**: User Stories 1 & 2 complete - MVP create/list cycle works

---

## Phase 5: User Story 3 - View Single Task (Priority: P2)

**Goal**: Authenticated users can view details of a specific owned task

**Independent Test**: Get task by ID, verify full details returned; get non-owned task, verify 404

**Spec Ref**: US3 - View Single Task, FR-013

### Implementation for User Story 3

- [x] T017 [US3] Implement get_task service function at `backend/app/services/task_service.py`
  - **Inputs**: Task model, Session
  - **Output**: get_task(session, user_id, task_id) -> Task | None
  - **Spec Ref**: FR-013, FR-004, FR-005, Constitution VII
  - **Steps**:
    1. Implement get_task function:
       - Create select(Task).where(Task.id == task_id, Task.user_id == user_id)
       - Execute and return first() (None if not found)
  - **Completion**: Returns task if owned, None if not found or not owned

- [x] T018 [US3] Implement GET /api/{user_id}/tasks/{task_id} endpoint at `backend/app/api/routes/tasks.py`
  - **Inputs**: deps.py, task_service.py, TaskResponse schema
  - **Output**: get_task route returning 200 or 404
  - **Spec Ref**: US3 acceptance scenarios, FR-013, FR-024
  - **Steps**:
    1. Implement GET "/{user_id}/tasks/{task_id}" endpoint:
       - Validate path user_id == current_user.id
       - Call get_task service
       - If None, raise HTTPException 404 "Task not found"
       - Return TaskResponse
  - **Completion**: GET returns task details, 404 for non-existent/non-owned

**Checkpoint**: User Story 3 complete - can view individual tasks

---

## Phase 6: User Story 4 - Update Task (Priority: P2)

**Goal**: Authenticated users can update title/description of owned tasks

**Independent Test**: Update task title, verify change persisted; update non-owned task, verify 404

**Spec Ref**: US4 - Update Task, FR-015, FR-016

### Implementation for User Story 4

- [x] T019 [US4] Implement update_task service function at `backend/app/services/task_service.py`
  - **Inputs**: Task model, TaskUpdate schema, Session
  - **Output**: update_task(session, user_id, task_id, data) -> Task | None
  - **Spec Ref**: FR-015, FR-016, FR-006
  - **Steps**:
    1. Import datetime
    2. Implement update_task function:
       - Call get_task to fetch owned task
       - If None, return None
       - Update title if provided (not None)
       - Update description if provided (not None)
       - Set updated_at = datetime.utcnow()
       - session.add(), session.commit(), session.refresh()
       - Return updated task
  - **Completion**: Function updates task fields, refreshes updated_at

- [x] T020 [US4] Implement PUT /api/{user_id}/tasks/{task_id} endpoint at `backend/app/api/routes/tasks.py`
  - **Inputs**: deps.py, task_service.py, TaskUpdate schema
  - **Output**: update_task route returning 200 or 404
  - **Spec Ref**: US4 acceptance scenarios, FR-015, FR-022, FR-024
  - **Steps**:
    1. Import TaskUpdate
    2. Implement PUT "/{user_id}/tasks/{task_id}" endpoint:
       - Validate path user_id == current_user.id
       - Call update_task service
       - If None, raise HTTPException 404
       - Return TaskResponse
  - **Completion**: PUT updates task, returns updated details

**Checkpoint**: User Story 4 complete - can update tasks

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Authenticated users can permanently delete owned tasks

**Independent Test**: Delete task, verify 204 response; verify task removed from list

**Spec Ref**: US5 - Delete Task, FR-018, FR-019

### Implementation for User Story 5

- [x] T021 [US5] Implement delete_task service function at `backend/app/services/task_service.py`
  - **Inputs**: Task model, Session
  - **Output**: delete_task(session, user_id, task_id) -> bool
  - **Spec Ref**: FR-018, FR-019
  - **Steps**:
    1. Implement delete_task function:
       - Call get_task to fetch owned task
       - If None, return False
       - session.delete(task)
       - session.commit()
       - Return True
  - **Completion**: Function deletes task from DB if owned

- [x] T022 [US5] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint at `backend/app/api/routes/tasks.py`
  - **Inputs**: deps.py, task_service.py
  - **Output**: delete_task route returning 204 or 404
  - **Spec Ref**: US5 acceptance scenarios, FR-018, FR-024
  - **Steps**:
    1. Import Response, status
    2. Implement DELETE "/{user_id}/tasks/{task_id}" endpoint:
       - Validate path user_id == current_user.id
       - Call delete_task service
       - If False, raise HTTPException 404
       - Return Response(status_code=204)
  - **Completion**: DELETE removes task, returns 204

**Checkpoint**: User Story 5 complete - can delete tasks

---

## Phase 8: User Story 6 - Toggle Completion (Priority: P3)

**Goal**: Authenticated users can toggle task completion status

**Independent Test**: Toggle incomplete task to complete, verify is_complete=true; toggle again, verify is_complete=false

**Spec Ref**: US6 - Toggle Task Completion, FR-017

### Implementation for User Story 6

- [x] T023 [US6] Implement toggle_complete service function at `backend/app/services/task_service.py`
  - **Inputs**: Task model, Session
  - **Output**: toggle_complete(session, user_id, task_id) -> Task | None
  - **Spec Ref**: FR-017, FR-016
  - **Steps**:
    1. Implement toggle_complete function:
       - Call get_task to fetch owned task
       - If None, return None
       - Set task.is_complete = not task.is_complete
       - Set updated_at = datetime.utcnow()
       - session.add(), session.commit(), session.refresh()
       - Return updated task
  - **Completion**: Function toggles is_complete, updates timestamp

- [x] T024 [US6] Implement PATCH /api/{user_id}/tasks/{task_id}/complete endpoint at `backend/app/api/routes/tasks.py`
  - **Inputs**: deps.py, task_service.py
  - **Output**: toggle_complete route returning 200 or 404
  - **Spec Ref**: US6 acceptance scenarios, FR-017, FR-024
  - **Steps**:
    1. Implement PATCH "/{user_id}/tasks/{task_id}/complete" endpoint:
       - Validate path user_id == current_user.id
       - Call toggle_complete service
       - If None, raise HTTPException 404
       - Return TaskResponse
  - **Completion**: PATCH toggles completion, returns updated task

**Checkpoint**: All user stories complete - full CRUD + toggle implemented

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, documentation, manual verification

- [x] T025 Add global exception handler for generic 500 errors at `backend/app/main.py`
  - **Inputs**: FastAPI exception handling
  - **Output**: Generic error handler hiding internal details
  - **Spec Ref**: FR-025, Constitution X
  - **Steps**:
    1. Import Request, JSONResponse
    2. Add @app.exception_handler(Exception) decorator
    3. Log actual error internally
    4. Return JSONResponse 500 with {"detail": "Internal server error"}
  - **Completion**: Unhandled exceptions return generic 500 message

- [x] T026 [P] Update models/__init__.py exports at `backend/app/models/__init__.py`
  - **Inputs**: task.py
  - **Output**: Clean exports
  - **Steps**:
    1. Add `from .task import Task`
  - **Completion**: `from app.models import Task` works

- [x] T027 [P] Update schemas/__init__.py exports at `backend/app/schemas/__init__.py`
  - **Inputs**: task.py schemas
  - **Output**: Clean exports
  - **Steps**:
    1. Add exports for TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
  - **Completion**: `from app.schemas import TaskCreate` works

- [x] T028 [P] Update services/__init__.py exports at `backend/app/services/__init__.py`
  - **Inputs**: task_service.py
  - **Output**: Clean exports
  - **Steps**:
    1. Add `from . import task_service`
  - **Completion**: `from app.services import task_service` works

- [x] T029 Create backend README at `backend/README.md`
  - **Inputs**: quickstart.md
  - **Output**: Setup and usage documentation
  - **Spec Ref**: Plan - Documentation
  - **Steps**:
    1. Copy relevant sections from quickstart.md
    2. Include setup instructions, env vars, running server
  - **Completion**: README explains how to run backend

---

## Phase 10: Manual Verification Checklist

**Purpose**: Verify all success criteria and ownership enforcement

### Pre-Verification Setup

- [ ] T030 Start backend server and verify health endpoint
  - **Steps**:
    1. Ensure DATABASE_URL and BETTER_AUTH_SECRET in .env
    2. Run `uvicorn app.main:app --reload`
    3. GET /health returns {"status": "ok"}
  - **Completion**: Server running, health check passes

### Verification Tests

- [ ] T031 Manual Test: Create 2 test users via Spec-1 auth system
  - **Inputs**: Frontend signup flow
  - **Output**: 2 JWT tokens (User A, User B)
  - **Spec Ref**: Assumptions - Spec-1 complete
  - **Completion**: Have valid JWTs for 2 different users

- [ ] T032 Manual Test: User A creates tasks, verifies ownership
  - **Steps**:
    1. POST /api/{user_a_id}/tasks with User A's JWT
    2. Create 2-3 tasks
    3. Verify 201 responses with user_a_id in response
  - **Spec Ref**: US1, FR-009
  - **Completion**: Tasks created with correct user_id

- [ ] T033 Manual Test: User A lists tasks, sees only own tasks
  - **Steps**:
    1. GET /api/{user_a_id}/tasks with User A's JWT
    2. Verify all tasks have user_a_id
  - **Spec Ref**: US2, FR-004
  - **Completion**: List shows only User A's tasks

- [ ] T034 Manual Test: User B cannot access User A's tasks
  - **Steps**:
    1. GET /api/{user_a_id}/tasks/{task_id} with User B's JWT
    2. Verify 404 returned (not 403)
  - **Spec Ref**: US3, FR-005, Constitution VII
  - **Completion**: Cross-user access returns 404

- [ ] T035 Manual Test: Missing JWT returns 401
  - **Steps**:
    1. GET /api/{user_id}/tasks without Authorization header
    2. Verify 401 "Not authenticated"
  - **Spec Ref**: FR-002, Constitution IV
  - **Completion**: Unauthenticated request rejected

- [ ] T036 Manual Test: Invalid JWT returns 401
  - **Steps**:
    1. GET /api/{user_id}/tasks with malformed/expired JWT
    2. Verify 401 "Invalid token"
  - **Spec Ref**: FR-002
  - **Completion**: Invalid token rejected

- [ ] T037 Manual Test: Full CRUD cycle
  - **Steps**:
    1. POST create task
    2. GET verify in list
    3. PUT update title
    4. GET verify update
    5. PATCH toggle complete
    6. GET verify is_complete=true
    7. DELETE task
    8. GET verify removed from list
  - **Spec Ref**: All user stories
  - **Completion**: Complete CRUD cycle works

- [ ] T038 Manual Test: Data persists after server restart
  - **Steps**:
    1. Create task
    2. Stop uvicorn
    3. Start uvicorn
    4. GET task list
    5. Verify task still exists
  - **Spec Ref**: FR-020, FR-021, SC-008
  - **Completion**: Tasks survive restart

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phases 3-8 (User Stories)**: All depend on Phase 2 completion
  - US1 (Create) and US2 (List): Can run in parallel after Phase 2
  - US3-6: Can run in parallel after Phase 2, or sequentially
- **Phase 9 (Polish)**: Depends on all user stories
- **Phase 10 (Verification)**: Depends on Phase 9

### User Story Dependencies

| Story | Priority | Depends On | Can Parallelize With |
|-------|----------|------------|---------------------|
| US1 - Create | P1 | Foundational | US2 |
| US2 - List | P1 | Foundational | US1 |
| US3 - Get Single | P2 | Foundational | US4, US5, US6 |
| US4 - Update | P2 | Foundational | US3, US5, US6 |
| US5 - Delete | P2 | Foundational | US3, US4, US6 |
| US6 - Toggle | P3 | Foundational | US3, US4, US5 |

### Within Each User Story

- Service function before API route
- Route implementation before error handling refinement

### Parallel Opportunities

```bash
# Phase 1 parallel tasks:
T002 [P] requirements.txt
T003 [P] .env.example

# Phase 2 parallel tasks:
T006 [P] Task model
T007 [P] Schemas

# After Foundational, all user stories can start in parallel
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create)
4. Complete Phase 4: User Story 2 (List)
5. **STOP and VALIDATE**: Test create/list cycle independently
6. Demo: Users can create and view tasks

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 + US2 → Test independently → Demo (MVP!)
3. Add US3 (Get Single) → Test → Demo
4. Add US4 (Update) → Test → Demo
5. Add US5 (Delete) → Test → Demo
6. Add US6 (Toggle) → Test → Demo (Full feature!)
7. Polish + Verification → Production ready

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1. Setup | T001-T004 | Project structure, dependencies |
| 2. Foundational | T005-T010 | Database, model, auth, FastAPI app |
| 3. US1 Create | T011-T014 | POST endpoint |
| 4. US2 List | T015-T016 | GET list endpoint |
| 5. US3 Get Single | T017-T018 | GET by ID endpoint |
| 6. US4 Update | T019-T020 | PUT endpoint |
| 7. US5 Delete | T021-T022 | DELETE endpoint |
| 8. US6 Toggle | T023-T024 | PATCH complete endpoint |
| 9. Polish | T025-T029 | Error handling, exports, docs |
| 10. Verification | T030-T038 | Manual testing checklist |

**Total Tasks**: 38
**MVP Tasks**: T001-T016 (16 tasks for Create + List)
**Parallel Opportunities**: 8 tasks marked [P]
