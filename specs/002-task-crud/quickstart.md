# Quickstart: Task Management API

**Feature**: 002-task-crud
**Date**: 2026-01-17

## Prerequisites

1. **Python 3.11+** installed
2. **Neon PostgreSQL** database provisioned
3. **Spec-1 Authentication** completed (Better Auth configured)
4. **Environment variables** configured

## Setup

### 1. Clone and Navigate

```bash
cd todo-fullstack/backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Create `.env` file in `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
BETTER_AUTH_SECRET=your-32-character-or-longer-secret-here
```

**Important**: `BETTER_AUTH_SECRET` must match the secret used by the frontend Better Auth configuration.

### 5. Initialize Database

```bash
python -c "from app.database import init_db, engine; init_db(engine)"
```

### 6. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Usage

### Base URL

```
http://localhost:8000/api
```

### Authentication

All requests require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by signing in via the frontend (Better Auth).

### Endpoints

#### List Tasks

```bash
curl -X GET "http://localhost:8000/api/{user_id}/tasks" \
  -H "Authorization: Bearer <token>"
```

**Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": "user_abc123",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "is_complete": false,
      "created_at": "2026-01-17T10:30:00Z",
      "updated_at": "2026-01-17T10:30:00Z"
    }
  ],
  "count": 1
}
```

#### Create Task

```bash
curl -X POST "http://localhost:8000/api/{user_id}/tasks" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'
```

**Response** (201 Created):
```json
{
  "id": 1,
  "user_id": "user_abc123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "is_complete": false,
  "created_at": "2026-01-17T10:30:00Z",
  "updated_at": "2026-01-17T10:30:00Z"
}
```

#### Get Task Details

```bash
curl -X GET "http://localhost:8000/api/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer <token>"
```

#### Update Task

```bash
curl -X PUT "http://localhost:8000/api/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy organic groceries"}'
```

#### Delete Task

```bash
curl -X DELETE "http://localhost:8000/api/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer <token>"
```

**Response** (204 No Content)

#### Toggle Completion

```bash
curl -X PATCH "http://localhost:8000/api/{user_id}/tasks/{task_id}/complete" \
  -H "Authorization: Bearer <token>"
```

## Error Responses

| Status | Meaning | Example |
|--------|---------|---------|
| 400 | Bad Request | `{"detail": "Title is required"}` |
| 401 | Unauthorized | `{"detail": "Not authenticated"}` |
| 404 | Not Found | `{"detail": "Task not found"}` |

## Testing

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=app --cov-report=html
```

### Manual Testing

1. **Create user A** via frontend signup
2. **Get JWT** from browser localStorage/cookies
3. **Create tasks** as user A
4. **List tasks** - verify only user A's tasks
5. **Create user B** via frontend signup
6. **Try accessing user A's tasks as user B** - should get 404

## Troubleshooting

### "Not authenticated" Error

- Verify JWT token is included in Authorization header
- Check token is not expired
- Ensure `BETTER_AUTH_SECRET` matches frontend

### "Task not found" for Existing Task

- Verify the task belongs to the authenticated user
- Check user_id in URL matches your JWT user ID

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Neon PostgreSQL is accessible
- Ensure SSL mode is set to `require`

## OpenAPI Documentation

When the server is running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json
