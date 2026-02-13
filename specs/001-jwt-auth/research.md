# Research: JWT Authentication

**Feature**: 001-jwt-auth
**Date**: 2026-01-11
**Status**: Complete

## Overview

This document consolidates research findings for implementing JWT authentication across the Next.js 16+ frontend (Better Auth) and FastAPI backend stack.

## Research Topics

### 1. Better Auth JWT Configuration

**Decision**: Use Better Auth with JWT session strategy and bearer token transport.

**Rationale**:
- Better Auth natively supports JWT tokens with configurable expiration
- JWT strategy enables stateless authentication suitable for API backends
- Bearer token transport aligns with constitution principle I (Authorization header)

**Alternatives Considered**:
- Session cookies: Rejected - doesn't work well with separate API backend
- Custom JWT implementation: Rejected - Better Auth handles token issuance securely

**Configuration Approach**:
```typescript
// Better Auth configuration for JWT
{
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (per FR-005)
  },
  secret: process.env.BETTER_AUTH_SECRET,
}
```

### 2. FastAPI JWT Verification

**Decision**: Use python-jose library for JWT verification with HS256 algorithm.

**Rationale**:
- python-jose is the standard JWT library for Python/FastAPI
- HS256 (HMAC-SHA256) uses symmetric keys matching BETTER_AUTH_SECRET
- FastAPI dependency injection pattern enables clean `get_current_user` implementation

**Alternatives Considered**:
- PyJWT: Similar functionality, python-jose slightly more feature-rich
- RS256 (asymmetric): More complex, requires key pair management - overkill for single-app

**Verification Pattern**:
```python
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401)
        return user_id
    except JWTError:
        raise HTTPException(status_code=401)
```

### 3. Password Hashing Strategy

**Decision**: Use passlib with bcrypt for password hashing.

**Rationale**:
- bcrypt is industry standard for password hashing
- Includes salt automatically
- Configurable work factor for future-proofing
- passlib provides consistent interface

**Alternatives Considered**:
- argon2: Newer, but bcrypt has wider ecosystem support
- SHA-256 with salt: Not designed for passwords, too fast

**Implementation**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

### 4. Token Storage (Frontend)

**Decision**: Use Better Auth's default secure storage mechanism with httpOnly cookies for session management, exposing JWT via API for backend calls.

**Rationale**:
- Better Auth handles secure token storage internally
- httpOnly cookies prevent XSS access to tokens
- JWT available via Better Auth client for Authorization header injection

**Alternatives Considered**:
- localStorage: Vulnerable to XSS attacks
- sessionStorage: Doesn't persist across tabs/sessions

### 5. Shared Secret Management

**Decision**: Use BETTER_AUTH_SECRET environment variable in both frontend and backend .env files.

**Rationale**:
- Single secret simplifies key management
- Environment variables keep secrets out of code
- Matches constitution principle II

**Implementation**:
- Frontend: `.env.local` → `BETTER_AUTH_SECRET=<32+ char secret>`
- Backend: `.env` → `BETTER_AUTH_SECRET=<same secret>`
- Both: Add to `.gitignore`

**Secret Generation**:
```bash
openssl rand -base64 32
```

### 6. API Client JWT Injection

**Decision**: Create custom fetch wrapper that retrieves JWT from Better Auth session and injects Authorization header.

**Rationale**:
- Centralizes auth header injection
- Works with any API endpoint
- Handles token refresh automatically via Better Auth

**Pattern**:
```typescript
async function apiClient(endpoint: string, options?: RequestInit) {
  const session = await auth.getSession();
  const token = session?.token;

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
}
```

### 7. Error Response Strategy

**Decision**: Return generic 401 Unauthorized for all auth failures, generic "Authentication failed" for login errors.

**Rationale**:
- Prevents user enumeration attacks (constitution principle V)
- Consistent error handling across endpoints
- No information leakage about valid emails

**Implementation**:
```python
# Backend - all auth failures return same response
HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)
```

```typescript
// Frontend - login errors are generic
catch (error) {
  setError("Authentication failed. Please check your credentials.");
}
```

## Dependencies Summary

### Frontend (package.json)
```json
{
  "dependencies": {
    "better-auth": "^1.x",
    "next": "^16.x",
    "react": "^19.x"
  }
}
```

### Backend (requirements.txt)
```text
fastapi>=0.109.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
sqlmodel>=0.0.14
python-dotenv>=1.0.0
uvicorn>=0.27.0
```

## Security Considerations

1. **Secret Strength**: BETTER_AUTH_SECRET must be cryptographically random, 32+ characters
2. **HTTPS Only**: Production must use HTTPS to prevent token interception
3. **Token Expiration**: 7-day default prevents indefinite session persistence
4. **No Enumeration**: Generic errors prevent email discovery attacks
5. **SQL Injection**: SQLModel with parameterized queries prevents injection

## Resolved Clarifications

All technical decisions have been made. No NEEDS CLARIFICATION items remain.

| Item | Resolution |
|------|------------|
| JWT Algorithm | HS256 (symmetric, uses shared secret) |
| Password Hashing | bcrypt via passlib |
| Token Storage | Better Auth managed (httpOnly) |
| Token Expiration | 7 days (configurable) |
| Frontend Framework | Next.js 16+ with App Router |
