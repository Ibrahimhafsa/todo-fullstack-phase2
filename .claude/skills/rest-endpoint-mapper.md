# Skill: rest-endpoint-mapper

## Purpose
Map and validate all REST API endpoints, ensure RESTful conventions, generate OpenAPI/Swagger documentation, create TypeScript types from API specs.

## Used By
- backend-expert
- frontend-expert
- spec-manager
- constitution-keeper

## Capabilities

### 1. Endpoint Discovery
- Scan all FastAPI route definitions
- Extract HTTP methods and paths
- Identify request/response schemas
- Document authentication requirements

### 2. RESTful Validation
- Verify proper HTTP method usage
- Check URL naming conventions
- Validate status code usage
- Ensure consistent response formats

### 3. Documentation Generation
- Generate OpenAPI 3.0 specs
- Create Swagger UI configuration
- Produce markdown API docs
- Build Postman collections

### 4. TypeScript Generation
- Generate interfaces from Pydantic
- Create API client methods
- Build type-safe fetch wrappers
- Produce Zod validation schemas

## RESTful Conventions

### HTTP Methods
```
GET     /api/tasks        # List all tasks (user's)
GET     /api/tasks/{id}   # Get single task
POST    /api/tasks        # Create new task
PUT     /api/tasks/{id}   # Full update task
PATCH   /api/tasks/{id}   # Partial update task
DELETE  /api/tasks/{id}   # Delete task
```

### Status Codes
```
200 OK           # Successful GET, PUT, PATCH
201 Created      # Successful POST (with Location header)
204 No Content   # Successful DELETE
400 Bad Request  # Validation error
401 Unauthorized # Missing/invalid JWT
403 Forbidden    # Valid JWT, insufficient permissions
404 Not Found    # Resource doesn't exist
422 Unprocessable# Semantic validation error
500 Internal     # Server error
```

### Response Formats
```json
// Success (single)
{
  "id": 1,
  "title": "...",
  ...
}

// Success (list)
{
  "items": [...],
  "total": 100,
  "page": 1,
  "per_page": 20
}

// Error
{
  "detail": "Error message",
  "code": "ERROR_CODE"
}
```

## Endpoint Map Template

```yaml
API Endpoint Map
================

Base URL: /api

Authentication:
  Type: Bearer JWT
  Header: Authorization: Bearer <token>

Endpoints:

  Tasks:
    - GET /tasks
      Auth: Required
      Query: ?completed=bool&page=int&per_page=int
      Response: TaskListResponse

    - GET /tasks/{id}
      Auth: Required
      Path: id (int)
      Response: Task
      Errors: 404

    - POST /tasks
      Auth: Required
      Body: TaskCreate
      Response: Task (201)

    - PUT /tasks/{id}
      Auth: Required
      Path: id (int)
      Body: TaskUpdate
      Response: Task
      Errors: 404

    - DELETE /tasks/{id}
      Auth: Required
      Path: id (int)
      Response: 204 No Content
      Errors: 404

  Auth:
    - POST /auth/login
      Auth: None
      Body: LoginRequest
      Response: TokenResponse

    - POST /auth/register
      Auth: None
      Body: RegisterRequest
      Response: UserResponse (201)

    - POST /auth/logout
      Auth: Required
      Response: 204 No Content
```

## OpenAPI Generation

### FastAPI Auto-Generation
```python
# main.py
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI(
    title="Todo API",
    description="Task management API",
    version="1.0.0"
)

# Access docs at /docs (Swagger) or /redoc (ReDoc)
```

### TypeScript Client Generation
```typescript
// Generated from OpenAPI spec
interface TasksAPI {
  list(params?: { completed?: boolean; page?: number }): Promise<TaskListResponse>;
  get(id: number): Promise<Task>;
  create(data: TaskCreate): Promise<Task>;
  update(id: number, data: TaskUpdate): Promise<Task>;
  delete(id: number): Promise<void>;
}
```

## Validation Checklist

### Endpoint Compliance
```
- [ ] Uses correct HTTP method for operation
- [ ] URL follows /api/{resource}/{id} pattern
- [ ] Returns appropriate status codes
- [ ] Includes authentication where required
- [ ] Has proper request validation
- [ ] Returns consistent response format
```

### Documentation Compliance
```
- [ ] All endpoints documented
- [ ] Request/response schemas defined
- [ ] Error responses listed
- [ ] Authentication requirements noted
- [ ] Examples provided
```
