---
id: 001
title: Authentication Constitution Creation
stage: constitution
date: 2026-01-11
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: hafsaibrahim
command: /sp.constitution
labels: ["authentication", "jwt", "better-auth", "fastapi", "constitution"]
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

## Purpose
Define non-negotiable rules, constraints, and quality standards
specifically for *authentication and user identity*.

## Scope (Allowed)
- User signup
- User signin
- JWT token issuance
- JWT verification
- Shared secret usage
- User identity extraction
- Authentication failure handling

## Explicitly Forbidden
- Task CRUD logic
- UI layout or styling decisions
- Database schema for tasks
- Any feature outside authentication

## Technology Constraints
- Frontend: Next.js 16+ with Better Auth
- Backend: FastAPI (Python)
- Auth mechanism: JWT tokens
- Secret sharing via BETTER_AUTH_SECRET

## Security Rules
- All protected routes require valid JWT
- Requests without JWT → 401 Unauthorized
- Backend must not trust client-provided user_id
- User identity must come from decoded JWT only

## Development Rules
- Spec-Driven Development is mandatory
- Flow must be:
  Constitution → Specify → Plan → Tasks → Implement
- ❌ No implementation without approved tasks

## Success Criteria
- Users can sign up and sign in
- JWT is issued and verified correctly
- Backend can identify authenticated user
- Unauthorized access is blocked

## Response snapshot

Created Authentication & User Identity Constitution v1.0.0 with 6 core principles:

1. **JWT-Only Authentication**: All auth via JWT tokens, Better Auth → Backend flow
2. **Shared Secret Synchronization**: BETTER_AUTH_SECRET must match frontend/backend
3. **User Identity Trust Boundary**: Backend extracts user_id from JWT only, never trusts client
4. **Protected Route Enforcement**: All user data routes require valid JWT → 401 on failure
5. **Authentication Failure Handling**: Generic error messages to prevent enumeration
6. **Spec-Driven Development Mandate**: Constitution → Specify → Plan → Tasks → Implement

Technology stack defined: Next.js 16+ (Better Auth) + FastAPI (Python) + JWT transport.
Governance section includes amendment process and compliance review requirements.

## Outcome

- ✅ Impact: Created foundational authentication constitution for the project
- 🧪 Tests: N/A - constitution is documentation
- 📁 Files: 1 file created (.specify/memory/constitution.md)
- 🔁 Next prompts: /sp.specify for authentication feature, then /sp.plan
- 🧠 Reflection: Constitution properly scopes to auth-only, explicitly forbids task logic

## Evaluation notes (flywheel)

- Failure modes observed: None - clean execution
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
