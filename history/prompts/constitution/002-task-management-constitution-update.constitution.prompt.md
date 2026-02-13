---
id: 002
title: Task Management Constitution Update
stage: constitution
date: 2026-01-17
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: 001-jwt-auth
user: hafsaibrahim
command: /sp.constitution
labels: ["spec-2", "task-management", "crud", "ownership", "neon-postgresql"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

Spec-2: Task Management (CRUD + Ownership).

## Purpose
Define non-negotiable rules, constraints, and quality standards for:
- Tasks
- REST APIs
- Database persistence (Neon PostgreSQL)
- User-scoped data ownership (JWT enforced)

This constitution governs ONLY Spec-2.

## Scope (Allowed)
Implement ONLY the following task features for the web app:
1. Add Task (title + description)
2. View Task List (status indicators)
3. Update Task
4. Delete Task
5. Mark Task Complete / Incomplete

## Required Technology (Locked)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth JWT tokens (already completed in Spec-1)
- Spec-Driven: Claude Code + Spec-Kit Plus
- No manual coding

##  REST API Requirements
Implement these REST endpoints (must exist and work):

- GET    /api/{user_id}/tasks             → list tasks
- POST   /api/{user_id}/tasks             → create task
- GET    /api/{user_id}/tasks/{id}        → task details
- PUT    /api/{user_id}/tasks/{id}        → update task
- DELETE /api/{user_id}/tasks/{id}        → delete task
- PATCH  /api/{user_id}/tasks/{id}/complete → toggle completion

## Ownership & Security Rules (Critical)
- All endpoints MUST require valid JWT
- Missing/invalid JWT → 401 Unauthorized
- Backend MUST NOT trust the {user_id} path parameter alone
- The authenticated user MUST be derived from JWT
- Every DB query MUST be filtered by authenticated user id
- Users must only view/modify/delete their own tasks

## Data Persistence Rules
- Tasks MUST be stored in Neon PostgreSQL
- In-memory storage is NOT allowed in Phase-2

## Determinism & Quality
- Consistent JSON responses
- Clear error handling (404, 401, 400)
- No crashes
- Clean structure: routes, models, db connection

## Explicitly Forbidden (Spec-2)
- UI styling decisions (belongs to Spec-3)
- Authentication implementation details (belongs to Spec-1 which you already created just before spec 2)
- Intermediate/advanced features:
  - priorities/tags
  - search/filter/sort
  - due dates/reminders
  - recurring tasks

## Success Criteria
Spec-2 is complete only if:
- All CRUD + toggle endpoints work
- Data is persisted in Neon DB
- Ownership rules are enforced for every request
- Unauthorized access is blocked correctly

## Response snapshot

Constitution updated from v1.0.0 to v1.1.0 (MINOR bump). Added 4 new principles for Spec-2 Task Management:
- VII. Task Ownership Enforcement
- VIII. Task Data Persistence
- IX. Task API Contract
- X. Error Response Standards

Updated Technology Constraints with SQLModel ORM and Neon PostgreSQL. Added Task Management scope and success criteria. All existing Spec-1 authentication principles preserved unchanged.

## Outcome

- Impact: Constitution now governs both authentication (Spec-1) and task management (Spec-2) with 10 core principles
- Tests: N/A (constitution update)
- Files: 1 modified (.specify/memory/constitution.md)
- Next prompts: /sp.specify for task management feature spec, /sp.plan for implementation planning
- Reflection: Version bump correctly identified as MINOR (new principles added, none modified/removed)

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Standard constitution update
- Next experiment (smallest change to try): N/A
