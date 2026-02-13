---
id: 002
title: Task CRUD Implementation Plan
stage: plan
date: 2026-01-17
surface: agent
model: claude-opus-4-5-20251101
feature: 002-task-crud
branch: 002-task-crud
user: hafsaibrahim
command: /sp.plan
labels: ["spec-2", "task-management", "fastapi", "sqlmodel", "neon-postgresql", "jwt"]
links:
  spec: specs/002-task-crud/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-task-crud/plan.md
  - specs/002-task-crud/research.md
  - specs/002-task-crud/data-model.md
  - specs/002-task-crud/quickstart.md
  - specs/002-task-crud/contracts/tasks-api.yaml
  - CLAUDE.md
tests:
  - null
---

## Prompt

for Spec-2: Task Management (CRUD + Ownership)*.
Base the plan strictly on /sp.specify

## Backend Architecture Overview
- FastAPI app exposes REST endpoints under /api/
- SQLModel models represent database tables
- Neon PostgreSQL used for persistent storage
- JWT middleware extracts authenticated user
- Routes enforce ownership on every DB query

## Components
1. Database connection module (DATABASE_URL from env)
2. SQLModel Task model + schema
3. CRUD service layer (create/list/get/update/delete/toggle)
4. API routes layer (/api/{user_id}/tasks...)
5. Auth dependency / middleware:
   - validates JWT
   - provides authenticated user id to handlers
6. Error handling strategy (HTTPException)

## Ownership Enforcement Strategy
- Extract auth_user_id from JWT
- Compare with {user_id} in URL
- Use auth_user_id as the real owner filter
- Never query tasks without WHERE user_id = auth_user_id

## Testing / Manual Verification Plan
- Create 2 users
- Ensure tasks do not leak between users
- Verify 401 behavior with missing token
- Verify CRUD works end-to-end with DB persistence

## Non-Goals
- No frontend UI work
- No styling work
- No auth config changes
- No advanced features

## Response snapshot

Created comprehensive implementation plan for Spec-2: Task Management with all Phase 0 and Phase 1 artifacts.

**Branch**: `002-task-crud`

**Artifacts Generated**:
- `plan.md` - Complete implementation plan with Constitution Check (all 10 principles PASS)
- `research.md` - 8 technical decisions documented with rationale
- `data-model.md` - Task entity schema, SQLModel definition, query patterns
- `contracts/tasks-api.yaml` - OpenAPI 3.1 specification for 6 endpoints
- `quickstart.md` - Developer setup and API usage guide
- `CLAUDE.md` - Updated with Python 3.11+, FastAPI, Neon PostgreSQL

**Component Architecture**:
1. Database connection (Neon PostgreSQL with pooling)
2. Task SQLModel (7 fields with validation)
3. Request/Response schemas (TaskCreate, TaskUpdate, TaskResponse)
4. CRUD service layer (6 operations)
5. API routes (6 endpoints under /api/{user_id}/tasks)
6. Auth dependency (JWT verification with PyJWT)
7. Ownership enforcement (double-check pattern)

**Constitution Compliance**: All 10 principles verified and PASS

## Outcome

- Impact: Complete Phase 0+1 planning artifacts ready for task generation
- Tests: N/A (planning phase)
- Files: 6 created/modified
- Next prompts: /sp.tasks to generate implementation tasks
- Reflection: User-provided architecture overview aligned perfectly with constitution requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution Check PASS (10/10 principles)
- Prompt variant (if applicable): Standard plan creation with user-provided architecture
- Next experiment (smallest change to try): N/A
