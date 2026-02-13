# Skill: jwt-auth-validator

## Purpose
Validate JWT token implementation across frontend (Better Auth) and backend (FastAPI), ensure proper token generation, verification, and user isolation.

## Used By
- backend-expert
- frontend-expert
- constitution-keeper

## Capabilities

### 1. Token Generation Validation
- Verify Better Auth configuration on frontend
- Validate JWT claims structure (sub, exp, iat)
- Ensure proper secret key usage
- Check token expiration settings

### 2. Token Verification
- Validate FastAPI JWT middleware implementation
- Verify signature validation logic
- Check expiration handling
- Ensure proper error responses (401)

### 3. User Isolation Verification
- Confirm user_id extraction from JWT
- Validate query filters include user_id
- Check all CRUD operations filter by user
- Prevent cross-user data access

### 4. Secret Key Synchronization
- Verify BETTER_AUTH_SECRET matches across stack
- Check environment variable configuration
- Validate secret key strength
- Ensure secrets are not hardcoded

## Validation Checklist

### Frontend (Better Auth)
```typescript
// Required configuration
- [ ] BETTER_AUTH_SECRET in .env
- [ ] JWT session strategy configured
- [ ] Token included in API requests (Authorization header)
- [ ] Token refresh handling
- [ ] Logout clears tokens
```

### Backend (FastAPI)
```python
# Required implementation
- [ ] JWT verification middleware
- [ ] get_current_user dependency
- [ ] Proper 401 response on invalid token
- [ ] User ID extraction from claims
- [ ] All protected routes use dependency
```

### User Isolation
```python
# Every query must filter by user_id
- [ ] SELECT: WHERE user_id = current_user.id
- [ ] INSERT: Set user_id = current_user.id
- [ ] UPDATE: WHERE user_id = current_user.id
- [ ] DELETE: WHERE user_id = current_user.id
```

## Security Patterns

### Correct Token Flow
```
1. User authenticates via Better Auth
2. Frontend receives JWT
3. Frontend includes JWT in Authorization: Bearer <token>
4. Backend validates signature with shared secret
5. Backend extracts user_id from claims
6. All queries filter by user_id
```

### Common Vulnerabilities to Detect
- Missing JWT on protected endpoints
- No user_id filter on queries
- Hardcoded secrets
- Missing token expiration
- Improper error handling exposing details

## Test Scenarios

1. **Valid Token**: Access granted, correct user data returned
2. **Missing Token**: 401 Unauthorized
3. **Invalid Signature**: 401 Unauthorized
4. **Expired Token**: 401 Unauthorized
5. **User A accessing User B data**: Empty result / 404
