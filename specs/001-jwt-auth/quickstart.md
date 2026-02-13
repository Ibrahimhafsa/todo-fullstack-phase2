# Quickstart: JWT Authentication

**Feature**: 001-jwt-auth
**Date**: 2026-01-11

This guide walks through setting up and testing the JWT authentication system.

## Prerequisites

- Node.js 20+ (for frontend)
- Python 3.11+ (for backend)
- Git

## Step 1: Environment Setup

### Generate Shared Secret

```bash
# Generate a 32+ character secret
openssl rand -base64 32
# Example output: K7xB9mN2pQrS5tU8vW0yZ3aB6cD9eF2g
```

### Backend Environment

Create `backend/.env`:
```env
BETTER_AUTH_SECRET=K7xB9mN2pQrS5tU8vW0yZ3aB6cD9eF2g
DATABASE_URL=sqlite:///./app.db
```

### Frontend Environment

Create `frontend/.env.local`:
```env
BETTER_AUTH_SECRET=K7xB9mN2pQrS5tU8vW0yZ3aB6cD9eF2g
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **CRITICAL**: Both secrets MUST be identical (Constitution Principle II)

## Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations (creates users table)
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

Verify: Open http://localhost:8000/docs to see Swagger UI

## Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Verify: Open http://localhost:3000

## Step 4: Test Authentication Flow

### 4.1 Sign Up

1. Navigate to http://localhost:3000/signup
2. Enter email and password (min 8 characters)
3. Click "Sign Up"
4. You should be redirected to dashboard with JWT token issued

### 4.2 Sign In

1. Navigate to http://localhost:3000/signin
2. Enter credentials from signup
3. Click "Sign In"
4. You should be redirected to dashboard

### 4.3 Test Protected Route (API)

```bash
# Get token from browser DevTools (Network tab, look for token in response)
TOKEN="your_jwt_token_here"

# Test authenticated endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/auth/me

# Expected: { "id": 1, "email": "user@example.com", ... }
```

### 4.4 Test Unauthorized Access

```bash
# Without token - should return 401
curl http://localhost:8000/api/auth/me

# Expected: { "detail": "Not authenticated" }

# With invalid token - should return 401
curl -H "Authorization: Bearer invalid_token" http://localhost:8000/api/auth/me

# Expected: { "detail": "Could not validate credentials" }
```

## Verification Checklist

Run through each item to confirm the feature works:

- [ ] Signup page loads at `/signup`
- [ ] Valid signup creates account and redirects to dashboard
- [ ] Duplicate email shows generic error (no enumeration)
- [ ] Signin page loads at `/signin`
- [ ] Valid signin issues JWT and redirects to dashboard
- [ ] Invalid credentials show generic "Authentication failed" message
- [ ] Protected pages redirect to signin when unauthenticated
- [ ] API calls include Authorization header automatically
- [ ] `/api/auth/me` returns current user when authenticated
- [ ] `/api/auth/me` returns 401 when not authenticated
- [ ] Token expiration (test after 7 days or modify expiration for testing)

## Common Issues

### "Could not validate credentials" on all requests

**Cause**: BETTER_AUTH_SECRET mismatch between frontend and backend

**Fix**: Ensure both `.env` files have identical BETTER_AUTH_SECRET values

### "Connection refused" from frontend

**Cause**: Backend not running or wrong port

**Fix**: Ensure backend is running on port 8000, check NEXT_PUBLIC_API_URL

### Signup succeeds but signin fails

**Cause**: Password hashing issue or database not persisting

**Fix**: Check backend logs, verify database file exists

## Next Steps

After authentication is working:
1. Run `/sp.tasks` to generate implementation tasks
2. Implement each task following the task list
3. Run the constitution-keeper agent for security audit
