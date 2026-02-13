# Skill: acceptance-criteria-tester

## Purpose
Generate test scenarios from acceptance criteria, create test data, validate implementations, run security tests (user isolation), and produce compliance reports.

## Used By
- constitution-keeper
- orchestrator
- backend-expert
- frontend-expert

## Capabilities

### 1. Test Scenario Generation
- Parse acceptance criteria from specs
- Generate test cases per criterion
- Create edge case scenarios
- Build negative test cases

### 2. Test Data Creation
- Generate realistic test data
- Create boundary value data
- Build invalid input cases
- Produce multi-user test sets

### 3. Implementation Validation
- Execute test scenarios
- Verify expected outcomes
- Document pass/fail results
- Track coverage metrics

### 4. Security Testing
- Test user isolation
- Verify authentication
- Check authorization
- Detect data leakage

## Test Generation Process

### From Acceptance Criteria
```markdown
# Spec Acceptance Criteria
- [ ] User can create a task with title and optional description
- [ ] User can mark tasks as complete/incomplete
- [ ] User can delete tasks
- [ ] User can only see their own tasks
```

### Generated Test Cases
```yaml
Test Suite: Task Management

TC-001: Create Task - Valid Input
  Given: Authenticated user
  When: POST /api/tasks with { title: "Test task" }
  Then: 201 Created with task object
  And: task.user_id equals current user

TC-002: Create Task - With Description
  Given: Authenticated user
  When: POST /api/tasks with { title: "Test", description: "Details" }
  Then: 201 Created with description field populated

TC-003: Create Task - Missing Title (Negative)
  Given: Authenticated user
  When: POST /api/tasks with { description: "No title" }
  Then: 422 Unprocessable Entity

TC-004: Mark Task Complete
  Given: Authenticated user with existing task
  When: PATCH /api/tasks/{id} with { completed: true }
  Then: 200 OK with completed: true

TC-005: User Isolation
  Given: User A and User B each have tasks
  When: User A requests GET /api/tasks
  Then: Only User A's tasks returned
  And: User B's tasks NOT in response
```

## Security Test Patterns

### User Isolation Tests
```python
# Test: User cannot access another user's task
def test_user_isolation():
    # Setup
    user_a = create_user("user_a@test.com")
    user_b = create_user("user_b@test.com")
    task_a = create_task(user_a, "User A Task")

    # Test: User B cannot access User A's task
    response = client.get(
        f"/api/tasks/{task_a.id}",
        headers=auth_header(user_b)
    )
    assert response.status_code == 404  # Not 403 (don't reveal existence)

# Test: User cannot delete another user's task
def test_cross_user_delete():
    user_a = create_user("user_a@test.com")
    user_b = create_user("user_b@test.com")
    task_a = create_task(user_a, "User A Task")

    response = client.delete(
        f"/api/tasks/{task_a.id}",
        headers=auth_header(user_b)
    )
    assert response.status_code == 404

    # Verify task still exists
    assert get_task(task_a.id) is not None
```

### Authentication Tests
```python
# Test: Unauthenticated access denied
def test_no_auth():
    response = client.get("/api/tasks")
    assert response.status_code == 401

# Test: Invalid token rejected
def test_invalid_token():
    response = client.get(
        "/api/tasks",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401

# Test: Expired token rejected
def test_expired_token():
    expired_token = create_token(expiry=-3600)  # Expired 1 hour ago
    response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 401
```

## Test Data Templates

### Valid Task Data
```json
{
  "valid_minimal": {
    "title": "Buy groceries"
  },
  "valid_full": {
    "title": "Complete project",
    "description": "Finish the todo app implementation",
    "completed": false
  },
  "valid_completed": {
    "title": "Done task",
    "completed": true
  }
}
```

### Invalid Task Data
```json
{
  "missing_title": {
    "description": "No title provided"
  },
  "empty_title": {
    "title": ""
  },
  "title_too_long": {
    "title": "A" * 300
  },
  "invalid_completed": {
    "title": "Test",
    "completed": "yes"
  }
}
```

### Multi-User Test Set
```json
{
  "users": [
    { "email": "alice@test.com", "tasks": ["Task A1", "Task A2"] },
    { "email": "bob@test.com", "tasks": ["Task B1"] }
  ]
}
```

## Compliance Report Template

```markdown
# Acceptance Criteria Compliance Report

## Feature: Task Management
**Spec**: specs/tasks/spec.md
**Date**: YYYY-MM-DD

## Summary
- Total Criteria: 10
- Passed: 9
- Failed: 1
- Coverage: 90%

## Results

| ID | Criterion | Status | Notes |
|----|-----------|--------|-------|
| AC-001 | Create task with title | ✅ Pass | |
| AC-002 | Optional description | ✅ Pass | |
| AC-003 | Mark complete | ✅ Pass | |
| AC-004 | User isolation | ✅ Pass | Security test passed |
| AC-005 | Pagination | ❌ Fail | Not implemented |

## Failed Criteria Details

### AC-005: Pagination
**Expected**: GET /api/tasks supports ?page=&per_page=
**Actual**: Returns all tasks without pagination
**Impact**: Medium - Performance issue with large datasets
**Recommendation**: Implement pagination in backend

## Security Test Results
- User isolation: PASS
- Authentication required: PASS
- No data leakage: PASS

## Recommendations
1. Implement pagination for task list
2. Add rate limiting
3. Add input validation tests
```

## Execution Checklist

```
- [ ] Parse all acceptance criteria from spec
- [ ] Generate test cases for each criterion
- [ ] Create positive test scenarios
- [ ] Create negative test scenarios
- [ ] Add boundary value tests
- [ ] Include security tests (isolation, auth)
- [ ] Generate test data
- [ ] Execute test suite
- [ ] Document results
- [ ] Produce compliance report
```
