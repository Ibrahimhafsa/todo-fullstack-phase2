# Data Model: JWT Authentication

**Feature**: 001-jwt-auth
**Date**: 2026-01-11
**Status**: Complete

## Entities

### User

The User entity represents a registered user in the system. This is the only persistent entity for the authentication feature.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique user identifier |
| email | String(255) | Unique, Not Null, Indexed | User's email address (login identifier) |
| hashed_password | String(255) | Not Null | bcrypt-hashed password |
| created_at | DateTime | Not Null, Default: now() | Account creation timestamp |
| updated_at | DateTime | Not Null, Default: now() | Last update timestamp |

**Validation Rules**:
- Email: Valid email format, max 255 characters
- Password: Minimum 8 characters before hashing (max 128)
- Email must be unique (case-insensitive matching recommended)

**Indexes**:
- `ix_user_email` on `email` (unique) - for login lookups

### JWT Token (Transient)

JWT tokens are not persisted in the database. They are generated and verified using cryptographic signatures.

| Claim | Type | Description |
|-------|------|-------------|
| sub | String | User ID (subject) |
| exp | Integer | Expiration timestamp (Unix epoch) |
| iat | Integer | Issued-at timestamp (Unix epoch) |
| type | String | Token type: "access" |

**Token Lifecycle**:
- Created: Upon successful signup/signin
- Valid: Until expiration (default 7 days)
- Invalidated: Only by expiration (no revocation in MVP)

## Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ id: int (PK)                                         │   │
│  │ email: string (unique, indexed)                      │   │
│  │ hashed_password: string                              │   │
│  │ created_at: datetime                                 │   │
│  │ updated_at: datetime                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            │ issues                          │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ JWT Token (transient, not persisted)                 │   │
│  │ sub: user.id                                         │   │
│  │ exp: timestamp                                       │   │
│  │ iat: timestamp                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## State Transitions

### User Account States

```
                    ┌─────────────┐
                    │   (none)    │
                    └──────┬──────┘
                           │ signup
                           ▼
                    ┌─────────────┐
                    │   Active    │
                    └─────────────┘
```

Note: User deactivation/deletion is out of scope for this feature.

### Authentication Session States

```
     ┌──────────────────┐
     │  Unauthenticated │
     └────────┬─────────┘
              │ signin/signup success
              ▼
     ┌──────────────────┐
     │  Authenticated   │◄────────────────┐
     │  (valid token)   │                 │
     └────────┬─────────┘                 │
              │                           │
              │ token expires             │ re-signin
              ▼                           │
     ┌──────────────────┐                 │
     │  Expired         │─────────────────┘
     └──────────────────┘
```

## SQLModel Definition (Backend)

```python
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(
        max_length=255,
        unique=True,
        index=True,
        nullable=False
    )
    hashed_password: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## TypeScript Types (Frontend)

```typescript
// User type (returned from API, never includes password)
interface User {
  id: number;
  email: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// Auth request types
interface SignUpRequest {
  email: string;
  password: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

// Auth response types
interface AuthResponse {
  user: User;
  token: string;
}

// Session type from Better Auth
interface Session {
  user: User;
  token: string;
  expires: string; // ISO 8601
}
```

## Pydantic Schemas (Backend)

```python
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Request schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str  # Min 8 chars validated at API layer

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Response schemas
class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class AuthResponse(BaseModel):
    user: UserResponse
    token: str
```

## Migration Notes

1. **Initial Migration**: Create `users` table with all fields
2. **Index**: Ensure `ix_user_email` unique index is created
3. **Seed Data**: No seed data required for auth (users self-register)

## Out of Scope (Future)

- User profile fields (name, avatar)
- Email verification status
- Password reset tokens
- Refresh tokens
- Session revocation table
