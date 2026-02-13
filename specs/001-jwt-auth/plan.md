# Implementation Plan: JWT Authentication

**Branch**: `001-jwt-auth` | **Date**: 2026-01-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-jwt-auth/spec.md`
**Constitution**: [Authentication & User Identity Constitution v1.0.0](../../.specify/memory/constitution.md)

## Summary

Implement JWT-based authentication for the Todo application using Better Auth on the frontend (Next.js 16+) and FastAPI on the backend. The system enables user signup/signin with email and password, issues JWT tokens upon successful authentication, and verifies tokens on all protected API requests. User identity is extracted solely from verified JWT claims, ensuring complete user data isolation.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Python 3.11+ (backend)
**Primary Dependencies**:
- Frontend: Next.js 16+, Better Auth, React 19+
- Backend: FastAPI, python-jose (JWT), passlib (password hashing)

**Storage**: SQLite (development), PostgreSQL (production) - User table only for auth
**Testing**: Jest/Vitest (frontend), pytest (backend)
**Target Platform**: Web application (browser + Linux server)
**Project Type**: Web application (frontend + backend monorepo)
**Performance Goals**:
- Token verification < 50ms overhead
- Support 100 concurrent auth requests
- Signup < 30s, Signin < 10s user experience

**Constraints**:
- BETTER_AUTH_SECRET must be 32+ characters
- HTTPS required in production
- No secrets in version control

**Scale/Scope**: Single-tenant MVP, 1000+ users capacity

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation |
|-----------|--------|----------------|
| I. JWT-Only Authentication | ✅ PASS | Better Auth issues JWT; FastAPI verifies |
| II. Shared Secret Synchronization | ✅ PASS | BETTER_AUTH_SECRET in both .env files |
| III. User Identity Trust Boundary | ✅ PASS | Backend extracts user_id from JWT only |
| IV. Protected Route Enforcement | ✅ PASS | All /api/* routes require JWT (except auth) |
| V. Authentication Failure Handling | ✅ PASS | Generic error messages, no enumeration |
| VI. Spec-Driven Development | ✅ PASS | Following Constitution → Spec → Plan → Tasks |

**Gate Status**: ✅ ALL PRINCIPLES SATISFIED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-jwt-auth/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
│   └── auth-api.yaml    # OpenAPI spec for auth endpoints
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py        # Settings with BETTER_AUTH_SECRET
│   │   ├── security.py      # JWT verification, password hashing
│   │   └── deps.py          # get_current_user dependency
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py          # SQLModel User definition
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── user.py          # Pydantic request/response schemas
│   └── api/
│       ├── __init__.py
│       └── auth.py          # Auth endpoints (if needed for verification)
├── tests/
│   ├── conftest.py
│   ├── test_auth.py         # Auth integration tests
│   └── test_security.py     # JWT verification unit tests
├── .env.example
└── requirements.txt

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   └── (protected)/
│   │       └── dashboard/
│   │           └── page.tsx
│   ├── lib/
│   │   ├── auth.ts          # Better Auth client configuration
│   │   ├── auth-client.ts   # Auth client instance
│   │   └── api.ts           # API client with JWT injection
│   ├── components/
│   │   ├── auth/
│   │   │   ├── SignInForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   └── providers/
│   │       └── AuthProvider.tsx
│   └── middleware.ts        # Route protection middleware
├── .env.local.example
└── package.json
```

**Structure Decision**: Web application structure selected per constitution Technology Constraints (Next.js 16+ frontend, FastAPI backend). Auth logic split between Better Auth (frontend token issuance) and FastAPI (backend verification).

## Complexity Tracking

> No violations detected. All implementation follows constitution principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
