# Prompt History Record

---
id: 005
title: "Better Auth Integration Fix"
stage: green
date: 2026-01-24
surface: agent
model: claude-opus-4-5
feature: 003-frontend-ui
branch: 003-frontend-ui
user: hafsaibrahim
command: /sp.implement
labels:
  - authentication
  - better-auth
  - jwt
  - next.js
links:
  spec: specs/003-frontend-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/lib/auth.ts
  - frontend/lib/auth-client.ts
  - frontend/app/api/auth/[...all]/route.ts
  - frontend/components/auth/SignInForm.tsx
  - frontend/components/auth/SignUpForm.tsx
  - frontend/components/providers/AuthProvider.tsx
  - backend/app/auth/jwt.py
  - backend/app/config.py
  - backend/requirements.txt
tests: []
---

## Prompt

Fix Authentication Integration (Better Auth) so Signup/Signin works.

## Current Bug
Frontend tries calling FastAPI:
- POST http://127.0.0.1:8000/api/auth/signup
- POST http://127.0.0.1:8000/api/auth/signin
These endpoints DO NOT exist in backend (Swagger confirms only task CRUD exists).

## Required Fix (Must Follow)
- Signup/Signin MUST be handled by Better Auth inside Next.js via app/api/auth/* routes.
- FastAPI backend should ONLY validate JWT for task endpoints.
- Do NOT add auth routes to FastAPI.
- Do NOT create duplicate SignIn/SignUp components.
- Keep UI theme unchanged (teal-cyan-black glow, glassy cards).

## Tasks
1. Create Better Auth route handlers under frontend/app/api/auth/...
2. Update existing SignInForm + SignUpForm to call the correct Better Auth endpoints.
3. Ensure Better Auth returns JWT/session usable by frontend API client.
4. Frontend must attach JWT to FastAPI requests.

## Output
- Signup works
- Signin works
- Redirect to dashboard works
- No 404 on /api/auth/signup

## Response

### Implementation Summary

Successfully implemented Better Auth integration for the frontend authentication system.

### Changes Made

**Frontend (Next.js):**
1. Installed `better-auth` and `better-sqlite3` packages
2. Created `frontend/lib/auth.ts` - Better Auth server configuration with JWT plugin
3. Created `frontend/lib/auth-client.ts` - Client-side auth with JWT token support
4. Created `frontend/app/api/auth/[...all]/route.ts` - Catch-all route handler for auth endpoints
5. Updated `SignInForm.tsx` - Now uses Better Auth `signIn.email()` method
6. Updated `SignUpForm.tsx` - Now uses Better Auth `signUp.email()` method
7. Updated `AuthProvider.tsx` - Integrated with Better Auth session and JWT token management

**Backend (FastAPI):**
1. Updated `backend/app/auth/jwt.py` - Changed from HS256 to JWKS-based verification for EdDSA tokens
2. Updated `backend/app/config.py` - Added `BETTER_AUTH_URL` setting for JWKS endpoint
3. Updated `backend/requirements.txt` - Added `pyjwt[crypto]` and `jwcrypto` for EdDSA support

### Architecture

```
Frontend (Next.js 16)              Backend (FastAPI)
├── Better Auth                    ├── JWT Verification
│   ├── SQLite database           │   └── JWKS-based (EdDSA)
│   ├── Session cookies           │
│   └── JWT plugin (EdDSA)        │
│                                  │
├── /api/auth/* routes            ├── /api/{user_id}/tasks
│   ├── sign-up/email             │   └── Protected by JWT
│   ├── sign-in/email             │
│   ├── token                     │
│   └── session                   │
```

### Verified Endpoints

- POST /api/auth/sign-up/email - Creates new user account
- POST /api/auth/sign-in/email - Authenticates user, returns session
- GET /api/auth/token - Returns JWT for FastAPI authentication
- GET /api/auth/session - Returns current session state

### Notes

- Better Auth uses EdDSA asymmetric signing (not HS256)
- Backend verifies tokens via JWKS endpoint at `/api/auth/jwks`
- JWT tokens include `sub` (user ID) and `email` claims for FastAPI
- Session tokens are stored in cookies for Better Auth session management
- JWT tokens are fetched separately for FastAPI API calls

## Outcome

Authentication flow is now fully functional with Better Auth handling signup/signin in Next.js and FastAPI validating JWT tokens for protected task endpoints.
