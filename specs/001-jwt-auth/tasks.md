# Tasks: JWT Authentication

**Input**: Design documents from `/specs/001-jwt-auth/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/auth-api.yaml
**Branch**: `001-jwt-auth`
**Date**: 2026-01-16

**Organization**: Tasks are grouped by required task groups to enable systematic implementation and testing.

## Format: `[ID] [P?] [Group] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Group]**: Which task group this belongs to (maps to required task groups)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/` (FastAPI)
- **Frontend**: `frontend/src/` (Next.js 16+)

---

## Phase 1: Setup (Project Structure)

**Purpose**: Initialize project structure and dependencies per plan.md

- [x] T001 Create backend directory structure per plan.md: `backend/app/{core,models,schemas,api}/__init__.py`
- [x] T002 Create `backend/requirements.txt` with dependencies: fastapi, python-jose[cryptography], passlib[bcrypt], sqlmodel, python-dotenv, uvicorn
- [x] T003 [P] Create `backend/.env.example` with BETTER_AUTH_SECRET and DATABASE_URL placeholders
- [x] T004 [P] Create frontend directory structure per plan.md: `frontend/src/{lib,components/auth,components/providers}`
- [x] T005 [P] Create `frontend/.env.local.example` with BETTER_AUTH_SECRET and NEXT_PUBLIC_API_URL placeholders

---

## Phase 2: Foundational (Core Infrastructure)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**CRITICAL**: Blocks all user story phases

- [x] T006 Implement settings configuration in `backend/app/core/config.py` with BETTER_AUTH_SECRET validation (32+ chars)
- [x] T007 Create FastAPI app entry point in `backend/app/main.py` with CORS configuration
- [x] T008 [P] Create User SQLModel in `backend/app/models/user.py` per data-model.md
- [x] T009 [P] Create Pydantic schemas in `backend/app/schemas/user.py`: UserCreate, UserLogin, UserResponse, TokenResponse, AuthResponse

**Checkpoint**: Foundation ready - task group implementation can begin

---

## Phase 3: Task Group 1 - Better Auth Configuration (Priority: P1)

**Goal**: Configure Better Auth on frontend for JWT session strategy with bearer token transport

**Independent Test**: Verify Better Auth initializes without errors and can be imported

**Spec Reference**: FR-003, FR-005, FR-011 | Research: Section 1 (Better Auth JWT Configuration)

### Implementation for Task Group 1

- [x] T010 [TG1] Create Better Auth server configuration in `frontend/src/lib/auth.ts` with JWT strategy and 7-day expiration
  - **Inputs**: BETTER_AUTH_SECRET from env, session strategy config
  - **Expected Output**: Export `auth` object with signUp, signIn, getSession methods
  - **Spec Reference**: FR-003, FR-005, research.md Section 1

- [x] T011 [TG1] Create Better Auth client instance in `frontend/src/lib/auth-client.ts`
  - **Inputs**: Auth configuration from auth.ts
  - **Expected Output**: Export `authClient` for use in components
  - **Spec Reference**: FR-003, FR-011

- [x] T012 [TG1] Create AuthProvider component in `frontend/src/components/providers/AuthProvider.tsx`
  - **Inputs**: authClient, React children
  - **Expected Output**: Context provider wrapping app with auth state
  - **Spec Reference**: FR-011, User Story 2 acceptance scenario 3

**Checkpoint**: Better Auth configured and ready for token issuance

---

## Phase 4: Task Group 2 - JWT Token Issuance (Priority: P1)

**Goal**: Implement signup/signin flows that issue JWT tokens upon successful authentication

**Independent Test**: Submit valid credentials and verify JWT token is returned in response

**Spec Reference**: FR-001, FR-002, FR-003, FR-004, FR-009 | User Stories 1 & 2

### Implementation for Task Group 2

- [x] T013 [TG2] Implement password hashing utilities in `backend/app/core/security.py` with bcrypt via passlib
  - **Inputs**: Plain password string
  - **Expected Output**: `hash_password()` and `verify_password()` functions
  - **Spec Reference**: research.md Section 3, data-model.md validation rules

- [x] T014 [TG2] Implement JWT token creation in `backend/app/core/security.py`
  - **Inputs**: user_id, BETTER_AUTH_SECRET, expiration (7 days default)
  - **Expected Output**: `create_access_token()` function returning JWT string
  - **Spec Reference**: FR-004, FR-005, research.md Section 2

- [x] T015 [TG2] Implement signup endpoint in `backend/app/api/auth.py` at POST `/api/auth/signup`
  - **Inputs**: SignUpRequest (email, password)
  - **Expected Output**: 201 with AuthResponse (user + token) or 400/409 with generic error
  - **Spec Reference**: FR-001, FR-002, FR-009, auth-api.yaml /api/auth/signup

- [x] T016 [TG2] Implement signin endpoint in `backend/app/api/auth.py` at POST `/api/auth/signin`
  - **Inputs**: SignInRequest (email, password)
  - **Expected Output**: 200 with AuthResponse or 401 with generic error
  - **Spec Reference**: FR-003, FR-009, auth-api.yaml /api/auth/signin

- [x] T017 [P] [TG2] Create SignUpForm component in `frontend/src/components/auth/SignUpForm.tsx`
  - **Inputs**: User email and password inputs
  - **Expected Output**: Form that calls signup endpoint, receives JWT, updates auth state
  - **Spec Reference**: User Story 1 acceptance scenarios 1-4

- [x] T018 [P] [TG2] Create SignInForm component in `frontend/src/components/auth/SignInForm.tsx`
  - **Inputs**: User email and password inputs
  - **Expected Output**: Form that calls signin endpoint, receives JWT, updates auth state
  - **Spec Reference**: User Story 2 acceptance scenarios 1-2

- [x] T019 [TG2] Create signup page in `frontend/src/app/(auth)/signup/page.tsx`
  - **Inputs**: SignUpForm component
  - **Expected Output**: Signup page accessible at /signup
  - **Spec Reference**: User Story 1

- [x] T020 [TG2] Create signin page in `frontend/src/app/(auth)/signin/page.tsx`
  - **Inputs**: SignInForm component
  - **Expected Output**: Signin page accessible at /signin
  - **Spec Reference**: User Story 2

**Checkpoint**: Users can signup and signin, receiving JWT tokens

---

## Phase 5: Task Group 3 - JWT Verification Middleware (Priority: P1)

**Goal**: Backend verifies JWT signature on all protected requests using shared secret

**Independent Test**: Send requests with valid/invalid/missing/expired tokens and verify correct 401/200 responses

**Spec Reference**: FR-006, FR-008 | User Story 3

### Implementation for Task Group 3

- [x] T021 [TG3] Implement JWT verification function in `backend/app/core/security.py`
  - **Inputs**: JWT token string, BETTER_AUTH_SECRET
  - **Expected Output**: `verify_token()` returning decoded payload or raising exception
  - **Spec Reference**: FR-006, research.md Section 2, User Story 3 scenarios 1-4

- [x] T022 [TG3] Implement OAuth2PasswordBearer scheme in `backend/app/core/deps.py`
  - **Inputs**: Token from Authorization header
  - **Expected Output**: `oauth2_scheme` dependency extracting bearer token
  - **Spec Reference**: FR-008, auth-api.yaml security scheme

- [x] T023 [TG3] Implement `/api/auth/verify` endpoint in `backend/app/api/auth.py`
  - **Inputs**: JWT token from Authorization header
  - **Expected Output**: 200 with {valid: true, user_id} or 401
  - **Spec Reference**: auth-api.yaml /api/auth/verify

- [x] T024 [TG3] Register auth router in `backend/app/main.py`
  - **Inputs**: auth.py router
  - **Expected Output**: All /api/auth/* routes available
  - **Spec Reference**: plan.md project structure

**Checkpoint**: JWT verification middleware operational

---

## Phase 6: Task Group 4 - User Identity Extraction (Priority: P1)

**Goal**: Extract user identity solely from verified JWT claims (not request body/params)

**Independent Test**: Authenticated request returns user data matching JWT sub claim

**Spec Reference**: FR-007, FR-012 | User Story 3

### Implementation for Task Group 4

- [x] T025 [TG4] Implement `get_current_user` dependency in `backend/app/core/deps.py`
  - **Inputs**: Verified JWT payload with 'sub' claim
  - **Expected Output**: User ID extracted from token (integer)
  - **Spec Reference**: FR-007, research.md Section 2, User Story 3 scenario 1

- [x] T026 [TG4] Implement `/api/auth/me` endpoint in `backend/app/api/auth.py` using `get_current_user`
  - **Inputs**: JWT token via get_current_user dependency
  - **Expected Output**: 200 with UserResponse (user data for authenticated user)
  - **Spec Reference**: FR-007, auth-api.yaml /api/auth/me, User Story 3 scenario 1

- [x] T027 [TG4] Create API client with JWT injection in `frontend/src/lib/api.ts`
  - **Inputs**: Endpoint path, fetch options
  - **Expected Output**: `apiClient()` that auto-injects Authorization: Bearer header
  - **Spec Reference**: FR-010, research.md Section 6

**Checkpoint**: User identity correctly extracted from JWT

---

## Phase 7: Task Group 5 - Unauthorized Access Handling (Priority: P1)

**Goal**: Return 401 for missing/invalid/expired tokens; redirect to signin on frontend

**Independent Test**: Unauthenticated requests return 401; protected pages redirect to signin

**Spec Reference**: FR-008, FR-009 | User Story 2 scenario 4, User Story 3 scenarios 2-5

### Implementation for Task Group 5

- [x] T028 [TG5] Ensure all auth failures return generic 401 in `backend/app/core/deps.py`
  - **Inputs**: Missing, invalid, or expired token
  - **Expected Output**: HTTPException 401 with "Could not validate credentials" (no enumeration)
  - **Spec Reference**: FR-008, FR-009, User Story 3 scenarios 2-4, Edge Cases

- [x] T029 [TG5] Create Next.js middleware for route protection in `frontend/src/middleware.ts`
  - **Inputs**: Request path, session state
  - **Expected Output**: Redirect to /signin for unauthenticated users on protected routes
  - **Spec Reference**: User Story 2 scenario 4, FR-010

- [x] T030 [TG5] Create protected dashboard page in `frontend/src/app/(protected)/dashboard/page.tsx`
  - **Inputs**: Authenticated user session
  - **Expected Output**: Dashboard showing user email, accessible only when authenticated
  - **Spec Reference**: User Story 2 scenario 3

- [x] T031 [TG5] Create root layout with AuthProvider in `frontend/src/app/layout.tsx`
  - **Inputs**: AuthProvider component, children
  - **Expected Output**: App wrapped with auth context
  - **Spec Reference**: plan.md project structure

- [x] T032 [TG5] Create home page with auth navigation in `frontend/src/app/page.tsx`
  - **Inputs**: Auth state
  - **Expected Output**: Home page with links to signin/signup or dashboard based on auth state
  - **Spec Reference**: plan.md project structure

**Checkpoint**: Unauthorized access properly handled across stack

---

## Phase 8: Task Group 6 - Manual Validation Checklist (Priority: P1)

**Goal**: Verify complete auth flow works end-to-end per quickstart.md

**Independent Test**: Run through all items in quickstart.md verification checklist

**Spec Reference**: All success criteria SC-001 through SC-007

### Implementation for Task Group 6

- [ ] T033 [TG6] Test signup flow: Valid signup creates account and issues JWT (MANUAL)
  - **Inputs**: New email and valid password
  - **Expected Output**: Account created, JWT returned, redirect to dashboard
  - **Spec Reference**: SC-001, User Story 1 scenario 1

- [ ] T034 [TG6] Test signup validation: Invalid email/password shows errors (MANUAL)
  - **Inputs**: Invalid email format or password < 8 chars
  - **Expected Output**: Validation errors displayed
  - **Spec Reference**: FR-002, User Story 1 scenario 3

- [ ] T035 [TG6] Test duplicate email: Generic error shown (no enumeration) (MANUAL)
  - **Inputs**: Existing email
  - **Expected Output**: "Registration failed" (not "email exists")
  - **Spec Reference**: FR-009, SC-005, User Story 1 scenario 2

- [ ] T036 [TG6] Test signin flow: Valid credentials issue JWT (MANUAL)
  - **Inputs**: Correct email and password
  - **Expected Output**: JWT returned, redirect to dashboard
  - **Spec Reference**: SC-002, User Story 2 scenario 1

- [ ] T037 [TG6] Test invalid signin: Generic error shown (MANUAL)
  - **Inputs**: Wrong email or password
  - **Expected Output**: "Authentication failed" (not which was wrong)
  - **Spec Reference**: FR-009, SC-005, User Story 2 scenario 2

- [ ] T038 [TG6] Test protected route: Unauthenticated redirects to signin (MANUAL)
  - **Inputs**: No JWT, access /dashboard
  - **Expected Output**: Redirect to /signin
  - **Spec Reference**: User Story 2 scenario 4

- [ ] T039 [TG6] Test API protection: Missing token returns 401 (MANUAL)
  - **Inputs**: curl /api/auth/me without Authorization header
  - **Expected Output**: 401 with "Could not validate credentials"
  - **Spec Reference**: SC-003, User Story 3 scenario 2

- [ ] T040 [TG6] Test API protection: Invalid token returns 401 (MANUAL)
  - **Inputs**: curl /api/auth/me with "Bearer invalid_token"
  - **Expected Output**: 401 with "Could not validate credentials"
  - **Spec Reference**: SC-003, User Story 3 scenario 3

- [ ] T041 [TG6] Test /api/auth/me: Returns authenticated user data (MANUAL)
  - **Inputs**: Valid JWT token
  - **Expected Output**: 200 with user id and email
  - **Spec Reference**: User Story 3 scenario 1

- [ ] T042 [TG6] Verify user isolation: User A cannot access User B data (MANUAL)
  - **Inputs**: User A's token, request for User B's resources
  - **Expected Output**: Empty results or 403/404 (no User B data exposed)
  - **Spec Reference**: SC-004, FR-012, User Story 3 scenario 5

**Checkpoint**: All acceptance criteria validated

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and documentation

- [x] T043 [P] Add .gitignore entries for .env files in backend/ and frontend/
- [x] T044 [P] Verify CORS configuration allows frontend origin in `backend/app/main.py`
- [ ] T045 Run full quickstart.md verification checklist end-to-end (MANUAL)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all task groups
- **Phases 3-7 (Task Groups 1-5)**: Depend on Phase 2 completion
  - Task Group 1 (Better Auth Config) blocks Task Groups 2 and 4-5 (frontend auth)
  - Task Group 2 (Token Issuance) blocks Task Groups 4-6
  - Task Group 3 (Verification) blocks Task Groups 4-5
  - Task Group 4 (Identity Extraction) blocks Task Group 5
  - Task Group 5 (Unauthorized Handling) blocks Task Group 6
- **Phase 8 (Validation)**: Depends on Phases 3-7 completion
- **Phase 9 (Polish)**: Depends on Phase 8

### Recommended Execution Order

1. T001 → T002 → T003-T005 (parallel)
2. T006 → T007 → T008-T009 (parallel)
3. T010 → T011 → T012
4. T013 → T014 → T015 → T016 → T017-T018 (parallel) → T019-T020 (parallel)
5. T021 → T022 → T023 → T024
6. T025 → T026 → T027
7. T028 → T029 → T030 → T031 → T032
8. T033-T042 (sequential validation)
9. T043-T045 (parallel where marked)

### Parallel Opportunities

**Within Phase 1:**
- T003, T004, T005 can run in parallel (different directories)

**Within Phase 2:**
- T008, T009 can run in parallel (models vs schemas)

**Within Phase 4:**
- T017, T018 can run in parallel (different component files)
- T019, T020 can run in parallel (different page files)

**Within Phase 9:**
- T043, T044 can run in parallel (different files)

---

## Implementation Strategy

### MVP First Approach

1. Complete Phases 1-2 (Setup + Foundation)
2. Complete Phase 3 (Better Auth Configuration)
3. Complete Phase 4 (JWT Token Issuance) - Users can now signup/signin
4. Complete Phase 5 (JWT Verification) - Backend validates tokens
5. Complete Phase 6 (User Identity Extraction) - /api/auth/me works
6. Complete Phase 7 (Unauthorized Handling) - Full protection
7. Complete Phase 8 (Validation) - Verify everything works
8. Complete Phase 9 (Polish)

### Task Count Summary

| Phase | Task Count | Description |
|-------|------------|-------------|
| Phase 1 | 5 | Setup |
| Phase 2 | 4 | Foundational |
| Phase 3 | 3 | Better Auth Config |
| Phase 4 | 8 | JWT Token Issuance |
| Phase 5 | 4 | JWT Verification Middleware |
| Phase 6 | 3 | User Identity Extraction |
| Phase 7 | 5 | Unauthorized Access Handling |
| Phase 8 | 10 | Manual Validation |
| Phase 9 | 3 | Polish |
| **Total** | **45** | |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [TGn] label maps task to required task groups for traceability
- All backend tasks use `backend/app/` paths
- All frontend tasks use `frontend/src/` paths
- Generic error messages throughout (no email/user enumeration)
- Commit after each task or logical group
- Stop at any checkpoint to validate progress
