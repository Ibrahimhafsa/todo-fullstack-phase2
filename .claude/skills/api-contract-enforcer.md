# Skill: api-contract-enforcer

## Purpose
Ensure frontend TypeScript types match backend Pydantic models, validate API endpoints consistency, and prevent contract drift between stack layers.

## Used By
- backend-expert
- frontend-expert
- constitution-keeper

## Capabilities

### 1. Type Synchronization
- Compare TypeScript interfaces to Pydantic models
- Detect field name mismatches
- Identify type incompatibilities
- Flag missing/extra fields

### 2. Endpoint Consistency
- Validate HTTP methods match spec
- Check URL patterns are consistent
- Verify request/response formats
- Ensure error response consistency

### 3. Contract Drift Prevention
- Monitor changes to models
- Alert on breaking changes
- Suggest synchronized updates
- Track version compatibility

### 4. Schema Generation
- Generate TypeScript from Pydantic
- Create OpenAPI documentation
- Build type-safe API clients
- Produce validation schemas

## Type Mapping Reference

### Pydantic to TypeScript
```
Python (Pydantic)     →  TypeScript
─────────────────────────────────────
str                   →  string
int                   →  number
float                 →  number
bool                  →  boolean
datetime              →  string (ISO 8601)
date                  →  string (YYYY-MM-DD)
UUID                  →  string
Optional[T]           →  T | null
List[T]               →  T[]
Dict[str, T]          →  Record<string, T>
```

## Contract Validation Checklist

### For Each Endpoint

```yaml
Endpoint: POST /api/tasks
Backend:
  - [ ] Route defined in FastAPI
  - [ ] Pydantic request schema
  - [ ] Pydantic response schema
  - [ ] JWT authentication required
  - [ ] Proper HTTP status codes

Frontend:
  - [ ] API client method exists
  - [ ] TypeScript request type
  - [ ] TypeScript response type
  - [ ] Error handling implemented
  - [ ] Loading states managed

Spec:
  - [ ] Endpoint documented
  - [ ] Request/response examples
  - [ ] Error scenarios listed
```

## Example Contract

### Backend (Pydantic)
```python
# backend/app/schemas/task.py
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime
```

### Frontend (TypeScript)
```typescript
// frontend/src/types/task.ts
interface TaskCreate {
  title: string;
  description?: string | null;
  completed?: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: number;
  created_at: string;  // ISO datetime
  updated_at: string;  // ISO datetime
}
```

## Validation Rules

### Breaking Changes (Require Version Bump)
- Removing a required field
- Changing field type
- Renaming fields
- Changing URL patterns
- Modifying authentication requirements

### Non-Breaking Changes
- Adding optional fields
- Adding new endpoints
- Expanding enum values
- Adding response headers

## Enforcement Actions

1. **Pre-commit**: Validate contracts before code commit
2. **PR Review**: Check for contract drift in PRs
3. **CI Pipeline**: Automated contract testing
4. **Runtime**: Type validation on API calls
