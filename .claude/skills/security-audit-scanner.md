# Skill: security-audit-scanner

## Purpose
Scan codebase for security vulnerabilities, verify all endpoints require JWT, check user data isolation, detect hardcoded secrets, validate BETTER_AUTH_SECRET match.

## Used By
- constitution-keeper
- backend-expert
- frontend-expert

## Capabilities

### 1. Authentication Audit
- Verify all protected endpoints require JWT
- Check token validation implementation
- Audit session management
- Review logout handling

### 2. User Isolation Verification
- Scan all database queries for user_id filter
- Detect potential data leakage paths
- Verify row-level security
- Check authorization logic

### 3. Secret Detection
- Scan for hardcoded credentials
- Check .env file presence
- Verify .gitignore coverage
- Detect exposed API keys

### 4. Secret Synchronization
- Validate BETTER_AUTH_SECRET matches
- Check JWT secret configuration
- Verify environment consistency
- Audit secret rotation capability

## Security Scan Checklist

### Authentication Security
```
- [ ] All /api/* routes require JWT (except public endpoints)
- [ ] JWT signature validation implemented
- [ ] Token expiration enforced
- [ ] Refresh token rotation (if applicable)
- [ ] Logout invalidates session
- [ ] Failed auth returns 401 (no details)
```

### Authorization Security
```
- [ ] Every query filters by user_id
- [ ] No direct object reference vulnerabilities
- [ ] Admin routes properly protected
- [ ] Role-based access enforced
```

### Secret Management
```
- [ ] No secrets in source code
- [ ] .env files in .gitignore
- [ ] BETTER_AUTH_SECRET in both .env files
- [ ] Secrets match across frontend/backend
- [ ] No secrets in client-side code
- [ ] API keys not exposed in responses
```

### Data Protection
```
- [ ] Passwords hashed (bcrypt/argon2)
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced in production
- [ ] No PII in logs
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output encoding)
```

## Vulnerability Patterns to Detect

### Hardcoded Secrets
```python
# VULNERABLE
SECRET_KEY = "my-secret-key-12345"
API_KEY = "sk_live_abc123..."

# SECURE
SECRET_KEY = os.getenv("SECRET_KEY")
API_KEY = os.getenv("API_KEY")
```

### Missing User Isolation
```python
# VULNERABLE - Returns all tasks
@app.get("/tasks")
async def get_tasks(db: Session):
    return db.query(Task).all()

# SECURE - Returns only user's tasks
@app.get("/tasks")
async def get_tasks(db: Session, user: User = Depends(get_current_user)):
    return db.query(Task).filter(Task.user_id == user.id).all()
```

### Missing Authentication
```python
# VULNERABLE - No auth required
@app.post("/tasks")
async def create_task(task: TaskCreate, db: Session):
    ...

# SECURE - Auth required
@app.post("/tasks")
async def create_task(
    task: TaskCreate,
    db: Session,
    user: User = Depends(get_current_user)  # REQUIRED
):
    ...
```

### SQL Injection
```python
# VULNERABLE
query = f"SELECT * FROM tasks WHERE title = '{user_input}'"

# SECURE - SQLModel/SQLAlchemy parameterization
db.query(Task).filter(Task.title == user_input).all()
```

## Scan Commands

```bash
# Find hardcoded secrets
grep -r "SECRET" --include="*.py" --include="*.ts" | grep -v ".env"
grep -r "password\s*=" --include="*.py" --include="*.ts"
grep -r "api_key\s*=" --include="*.py" --include="*.ts"

# Find missing auth dependencies
grep -r "def.*async" backend/app/api/ | grep -v "get_current_user"

# Check .gitignore
cat .gitignore | grep -E "\.env|secrets"

# Find exposed environment variables
grep -r "process.env" frontend/src/ | grep -v "NEXT_PUBLIC"
```

## Security Report Format

```markdown
# Security Audit Report

## Summary
- Critical: X issues
- High: X issues
- Medium: X issues
- Low: X issues

## Critical Issues
### [CRIT-001] Missing Authentication on /api/tasks
- **Location**: backend/app/api/tasks.py:45
- **Risk**: Unauthorized data access
- **Fix**: Add `Depends(get_current_user)`

## Recommendations
1. ...
2. ...
```
