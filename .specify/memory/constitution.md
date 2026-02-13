<!--
  ============================================================================
  SYNC IMPACT REPORT
  ============================================================================
  Version Change: 1.1.0 → 1.2.0 (MINOR - Added Spec-3 Frontend UI principles)

  Modified Principles: None (existing principles unchanged)

  Added Sections:
  - Core Principles: XI. Frontend Workspace Isolation (Spec-3)
  - Core Principles: XII. Design System Compliance (Spec-3)
  - Core Principles: XIII. Responsive Layout Requirements (Spec-3)
  - Core Principles: XIV. UX State Management (Spec-3)
  - Core Principles: XV. Frontend-Backend Integration (Spec-3)
  - Development Workflow: Spec-3 Frontend UI Scope
  - Development Workflow: Spec-3 Success Criteria
  - Development Workflow: Explicitly Forbidden (Spec-3) additions

  Removed Sections: None

  Templates Requiring Updates:
  - .specify/templates/plan-template.md ✅ (Constitution Check section compatible)
  - .specify/templates/spec-template.md ✅ (Requirements section compatible)
  - .specify/templates/tasks-template.md ✅ (Phase structure compatible)

  Follow-up TODOs: None
  ============================================================================
-->

# Project Constitution: Authentication, Task Management & Frontend UI

## Overview

This constitution defines non-negotiable rules, constraints, and quality standards for:
- **Spec-1**: User authentication and identity (JWT-based)
- **Spec-2**: Task management (CRUD + ownership)
- **Spec-3**: Frontend UI and responsive experience

All implementation MUST comply with this constitution.

## Core Principles

### I. JWT-Only Authentication

All user authentication MUST use JSON Web Tokens (JWT) as the sole authentication
mechanism. The token flow is:

1. User authenticates via Better Auth (frontend)
2. Better Auth issues JWT with user claims
3. Frontend includes JWT in `Authorization: Bearer <token>` header
4. Backend validates JWT signature using shared secret
5. User identity extracted from JWT claims only

**Rationale**: Single authentication standard ensures consistency across the stack
and enables stateless verification.

### II. Shared Secret Synchronization

The `BETTER_AUTH_SECRET` environment variable MUST be identical in both frontend
and backend environments:

- Frontend: `.env.local` or `.env`
- Backend: `.env`

**Rules**:
- Secret MUST be at least 32 characters
- Secret MUST NOT be committed to version control
- Secret MUST be rotated if compromised
- Mismatched secrets result in authentication failure

**Rationale**: JWT signature verification requires the same secret on both sides.

### III. User Identity Trust Boundary

The backend MUST NEVER trust client-provided user identity. All user identification
MUST come from the decoded JWT token:

```python
# CORRECT: Extract user_id from JWT
user_id = get_current_user_from_jwt(token).id

# FORBIDDEN: Trust client-provided user_id
user_id = request.body.user_id  # NEVER DO THIS
```

**Rationale**: Client data can be manipulated; JWT claims are cryptographically signed.

### IV. Protected Route Enforcement

All API routes handling user data MUST require valid JWT authentication:

- Missing JWT → `401 Unauthorized`
- Invalid/expired JWT → `401 Unauthorized`
- Valid JWT → Extract user identity and proceed

**Exceptions**: Only public endpoints (health check, auth endpoints) are exempt.

**Rationale**: Defense in depth; no route should accidentally expose user data.

### V. Authentication Failure Handling

Authentication failures MUST return minimal information to prevent enumeration attacks:

- Invalid credentials → Generic "Authentication failed" message
- User not found → Same generic message (no "user does not exist")
- Rate limiting SHOULD be applied to auth endpoints

**Rationale**: Detailed error messages aid attackers in credential stuffing.

### VI. Spec-Driven Development Mandate

All implementation MUST follow the SDD workflow:

```
Constitution → Specify → Plan → Tasks → Implement
```

**Rules**:
- NO implementation without approved specification
- NO implementation without approved tasks
- Spec changes require re-approval before implementation
- Constitution violations block PR approval

**Rationale**: Ensures security requirements are explicitly documented and reviewed.

### VII. Task Ownership Enforcement (Spec-2)

All task operations MUST enforce user ownership:

```python
# CORRECT: Filter by authenticated user
tasks = db.query(Task).filter(Task.user_id == current_user.id).all()

# FORBIDDEN: Trust path parameter without verification
tasks = db.query(Task).filter(Task.user_id == path_user_id).all()  # NEVER
```

**Rules**:
- The `{user_id}` path parameter MUST NOT be trusted alone
- The authenticated user MUST be derived from JWT claims
- Every DB query MUST be filtered by the authenticated user's ID
- Users MUST only view, modify, or delete their own tasks
- Cross-user access attempts MUST return `401 Unauthorized`

**Rationale**: Path parameters can be manipulated; only JWT-derived identity is trusted.

### VIII. Task Data Persistence (Spec-2)

All task data MUST be persisted in Neon PostgreSQL:

**Rules**:
- In-memory storage is FORBIDDEN for task data
- Tasks MUST survive server restarts
- Database connection MUST use environment variables (never hardcode credentials)
- SQLModel MUST be used as the ORM layer

**Rationale**: Production-grade persistence ensures data durability and enables scaling.

### IX. Task API Contract (Spec-2)

The following REST endpoints MUST be implemented:

| Method | Endpoint | Action |
|--------|----------|--------|
| GET | `/api/{user_id}/tasks` | List user's tasks |
| POST | `/api/{user_id}/tasks` | Create a new task |
| GET | `/api/{user_id}/tasks/{id}` | Get task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

**Rules**:
- All endpoints MUST require valid JWT
- All endpoints MUST enforce ownership (Principle VII)
- Task entity MUST include: `id`, `title`, `description`, `is_complete`, `user_id`
- Timestamps (`created_at`, `updated_at`) SHOULD be included

**Rationale**: RESTful contract ensures predictable client integration.

### X. Error Response Standards (Spec-2)

All API responses MUST follow consistent patterns:

| Status | Condition |
|--------|-----------|
| `200 OK` | Successful GET, PUT, PATCH |
| `201 Created` | Successful POST |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Invalid request body/parameters |
| `401 Unauthorized` | Missing/invalid JWT or ownership violation |
| `404 Not Found` | Task does not exist (for the authenticated user) |

**Rules**:
- Error responses MUST include a JSON body with `detail` field
- Error messages MUST NOT leak internal implementation details
- `404` MUST be returned even if task exists but belongs to another user

**Rationale**: Consistent errors simplify client error handling and prevent info leakage.

### XI. Frontend Workspace Isolation (Spec-3)

All frontend work MUST respect strict workspace boundaries:

**Rules**:
- All frontend work MUST happen ONLY inside `/frontend`
- The `/frontend-DO-NOT-TOUCH` directory MUST NEVER be modified (backup folder)
- The Next.js app MUST NOT be recreated; use existing structure
- Auth components that already exist MUST NOT be duplicated
- Before editing any file, MUST verify it doesn't already exist elsewhere

**Rationale**: Prevents accidental corruption of backup code and duplicate implementations.

### XII. Design System Compliance (Spec-3)

All UI components MUST adhere to the established design system:

**Required Visual Theme**:
- Background: soft black/dark base with teal/cyan glow accents
- Cards: glassy (semi-transparent), blur effect, `rounded-xl`
- Buttons: modern appearance with soft glow on hover
- Inputs: clean, high-contrast with visible focus ring
- Smooth hover transitions on all interactive elements

**Rules**:
- Styling MUST use Tailwind CSS utility classes only
- Inline CSS is FORBIDDEN
- UI MUST appear premium, modern, and hackathon-demo ready
- Custom CSS files are allowed only for Tailwind configuration

**Rationale**: Consistent visual language creates professional user experience.

### XIII. Responsive Layout Requirements (Spec-3)

All pages MUST be fully responsive across device sizes:

**Rules**:
- Mobile-first breakpoints MUST be applied (sm → md → lg → xl)
- Layout MUST NOT break on viewports 320px to 2560px wide
- Touch targets MUST be minimum 44x44px on mobile
- Text MUST remain readable without horizontal scrolling
- No layout shifts or flash of unstyled content (FOUC)

**Rationale**: Ensures usability across all devices for demo and production use.

### XIV. UX State Management (Spec-3)

All data-driven pages MUST handle loading, empty, and error states:

**Required States**:
- **Loading State**: Visual indicator while data is being fetched
- **Empty State**: Clear messaging when no data exists (e.g., "No tasks yet")
- **Error State**: User-friendly error message with retry option

**Rules**:
- States MUST be visually distinct and on-theme
- Loading indicators MUST appear within 100ms of request initiation
- Error messages MUST NOT expose technical details
- Retry actions MUST be obvious and accessible

**Rationale**: Prevents user confusion and ensures graceful handling of edge cases.

### XV. Frontend-Backend Integration (Spec-3)

All frontend API calls MUST follow integration rules:

**Rules**:
- Every API request MUST include JWT token in Authorization header
- If API returns `401 Unauthorized` → redirect to Sign In page
- API base URL MUST be configured via environment variable
- No backend modifications are allowed in Spec-3
- No direct database access from frontend

**Rationale**: Ensures secure, consistent communication with backend services.

## Technology Constraints

This constitution applies to the following technology stack:

| Layer | Technology | Role |
|-------|------------|------|
| Frontend | Next.js 16+ (App Router) | Better Auth client, JWT storage, UI |
| Styling | Tailwind CSS | Utility-first styling |
| Auth Library | Better Auth | JWT issuance, session management |
| Backend | FastAPI (Python 3.11+) | JWT verification, API endpoints |
| ORM | SQLModel | Database operations |
| Database | Neon Serverless PostgreSQL | Persistent storage |
| Transport | HTTPS | Secure transmission |

**Stack-Specific Rules**:
- Better Auth MUST be configured with JWT session strategy
- FastAPI MUST use dependency injection for auth (`Depends(get_current_user)`)
- Tokens MUST be transmitted via Authorization header (not cookies for API)
- SQLModel MUST be used for all database models
- Database credentials MUST be loaded from environment variables
- Tailwind CSS MUST be used for all styling (no inline CSS)

## Development Workflow

### Spec-1: Authentication Scope

This constitution governs:
- User signup flow
- User signin flow
- JWT token issuance (Better Auth)
- JWT token verification (FastAPI)
- Shared secret configuration
- User identity extraction from JWT
- Authentication failure handling
- Protected route middleware

### Spec-2: Task Management Scope

This constitution governs:
- Task CRUD operations (Create, Read, Update, Delete)
- Task completion toggle
- Task ownership enforcement
- Task persistence in Neon PostgreSQL
- Task API endpoint contracts

### Spec-3: Frontend UI Scope

This constitution governs:
- Auth pages (signin, signup) styling and UX
- Protected Task Dashboard implementation
- Task CRUD UI components:
  - Create task form
  - Task list display
  - Update task functionality
  - Delete task confirmation
  - Toggle completion interaction
- Responsive layout (mobile/tablet/desktop)
- Design system implementation (teal–cyan–black glow theme)
- Loading, empty, and error state handling
- Frontend-backend API integration

### Explicitly Forbidden

The following are OUT OF SCOPE for this constitution:

**Forbidden in Spec-3 (Phase-2)**:
- Search/filter/sort functionality
- Tags or priorities
- Due dates or reminders
- Recurring tasks
- Backend modifications
- Database changes
- New Next.js app creation
- Editing `/frontend-DO-NOT-TOUCH`
- Duplicating existing auth components

**Deferred to Future Specs**:
- Task sharing/collaboration
- Multi-user task boards
- Task comments or attachments
- Real-time updates (WebSockets)
- Offline support

### Spec-1 Success Criteria

Authentication implementation is complete when:
- [ ] Users can sign up with email/password
- [ ] Users can sign in and receive JWT
- [ ] JWT is correctly validated by backend
- [ ] Backend correctly identifies authenticated user from JWT
- [ ] Unauthorized access returns 401
- [ ] User data isolation is enforced

### Spec-2 Success Criteria

Task Management implementation is complete when:
- [ ] All CRUD endpoints work correctly
- [ ] Toggle completion endpoint works
- [ ] Data is persisted in Neon PostgreSQL
- [ ] Ownership rules are enforced for every request
- [ ] Unauthorized access returns 401
- [ ] Non-existent tasks return 404
- [ ] Response formats are consistent

### Spec-3 Success Criteria

Frontend UI implementation is complete when:
- [ ] UI displays modern teal/cyan/black glowing theme
- [ ] Dashboard is fully responsive (mobile + tablet + desktop)
- [ ] Task CRUD works end-to-end from UI
- [ ] Loading states display during API calls
- [ ] Empty state shows when no tasks exist
- [ ] Error states display with retry option
- [ ] 401 responses redirect to Sign In
- [ ] No duplicate files were created
- [ ] No edits made to `/frontend-DO-NOT-TOUCH`

## Governance

### Amendment Process

1. Propose change with rationale
2. Document security impact analysis
3. Update version following semver:
   - MAJOR: Principle removal or redefinition
   - MINOR: New principle or expanded guidance
   - PATCH: Clarifications, typo fixes
4. Update dependent templates if affected
5. Commit with message: `docs: amend constitution to vX.Y.Z (<summary>)`

### Compliance Review

- All PRs MUST be verified against this constitution
- Authentication, Task Management, and Frontend UI changes require explicit constitution check
- Violations MUST be resolved before merge
- Security exceptions require documented justification and ADR

### Supersession

This constitution supersedes all other authentication, task management, and frontend UI
guidance in the project. When conflicts arise, this document takes precedence.

**Version**: 1.2.0 | **Ratified**: 2026-01-11 | **Last Amended**: 2026-01-23
