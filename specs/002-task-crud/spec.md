# Feature Specification: Task Management (CRUD + Ownership)

**Feature Branch**: `002-task-crud`
**Created**: 2026-01-17
**Status**: Draft
**Constitution**: Spec-2 (governed by `.specify/memory/constitution.md` v1.1.0)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Task (Priority: P1)

As an authenticated user, I want to create a task with a title and description so I can track what I need to do.

**Why this priority**: Creating tasks is the foundational action. Without the ability to create tasks, no other task management features have value. This is the minimum viable functionality.

**Independent Test**: Can be fully tested by creating a task with title/description and verifying it appears in the user's task list.

**Acceptance Scenarios**:

1. **Given** I am logged in with a valid session, **When** I submit a new task with title "Buy groceries" and description "Milk, eggs, bread", **Then** the task is created and I receive confirmation with the task details including a unique ID.

2. **Given** I am logged in with a valid session, **When** I submit a new task with only a title "Call dentist" (no description), **Then** the task is created successfully with an empty description.

3. **Given** I am logged in with a valid session, **When** I submit a task with an empty title, **Then** I receive an error indicating title is required.

4. **Given** I am not logged in (no valid token), **When** I attempt to create a task, **Then** I receive an unauthorized error and the task is not created.

---

### User Story 2 - View Task List (Priority: P1)

As an authenticated user, I want to view all my tasks so I can see pending and completed work.

**Why this priority**: Viewing tasks is equally critical to creating them. Users need to see their tasks immediately after creation. This completes the minimum read/write cycle.

**Independent Test**: Can be fully tested by retrieving the task list and verifying it shows all user's tasks with completion status.

**Acceptance Scenarios**:

1. **Given** I am logged in and have 3 tasks (2 incomplete, 1 complete), **When** I request my task list, **Then** I see all 3 tasks with their titles, descriptions, and completion status clearly indicated.

2. **Given** I am logged in and have no tasks, **When** I request my task list, **Then** I receive an empty list (not an error).

3. **Given** I am not logged in, **When** I attempt to view tasks, **Then** I receive an unauthorized error.

4. **Given** I am logged in as User A, **When** I request my task list, **Then** I only see tasks belonging to User A, not tasks from User B or any other user.

---

### User Story 3 - View Single Task (Priority: P2)

As an authenticated user, I want to view details of a specific task so I can see its full information.

**Why this priority**: While listing provides overview, viewing single task details is important for focused task review. Lower priority than list because list covers the basic need.

**Independent Test**: Can be fully tested by requesting a specific task by ID and verifying full details are returned.

**Acceptance Scenarios**:

1. **Given** I am logged in and own task with ID 5, **When** I request task 5's details, **Then** I see the complete task including id, title, description, completion status, and timestamps.

2. **Given** I am logged in and task ID 999 does not exist, **When** I request task 999, **Then** I receive a not-found error.

3. **Given** I am logged in as User A and task ID 10 belongs to User B, **When** I request task 10, **Then** I receive a not-found error (not revealing the task exists).

---

### User Story 4 - Update Task (Priority: P2)

As an authenticated user, I want to update a task so I can correct or change task details.

**Why this priority**: Users frequently need to modify task details after creation. Essential for practical task management but secondary to create/view.

**Independent Test**: Can be fully tested by updating a task's title/description and verifying the changes persist.

**Acceptance Scenarios**:

1. **Given** I am logged in and own task 5 with title "Buy groceries", **When** I update the title to "Buy organic groceries", **Then** the task is updated and I receive the modified task details.

2. **Given** I am logged in and own task 5, **When** I update only the description, **Then** only the description changes while the title remains unchanged.

3. **Given** I am logged in and task ID 999 does not exist, **When** I attempt to update it, **Then** I receive a not-found error.

4. **Given** I am logged in as User A and task 10 belongs to User B, **When** I attempt to update task 10, **Then** I receive a not-found error.

5. **Given** I am logged in and own task 5, **When** I attempt to update with an empty title, **Then** I receive a validation error and the task is not modified.

---

### User Story 5 - Delete Task (Priority: P2)

As an authenticated user, I want to delete a task so I can remove tasks I no longer need.

**Why this priority**: Cleanup is important for task management hygiene. Users need to remove obsolete tasks but this is less frequent than create/view/update.

**Independent Test**: Can be fully tested by deleting a task and verifying it no longer appears in the task list.

**Acceptance Scenarios**:

1. **Given** I am logged in and own task 5, **When** I delete task 5, **Then** the task is removed and I receive confirmation.

2. **Given** I am logged in and task ID 999 does not exist, **When** I attempt to delete it, **Then** I receive a not-found error.

3. **Given** I am logged in as User A and task 10 belongs to User B, **When** I attempt to delete task 10, **Then** I receive a not-found error (ownership enforced).

4. **Given** I deleted task 5, **When** I request my task list, **Then** task 5 is no longer included.

---

### User Story 6 - Toggle Task Completion (Priority: P3)

As an authenticated user, I want to mark a task complete or incomplete so I can track my progress.

**Why this priority**: Completion tracking is the core value of a todo app. Slightly lower priority because it's a specialized update, but still essential.

**Independent Test**: Can be fully tested by toggling a task's completion and verifying the status changes.

**Acceptance Scenarios**:

1. **Given** I am logged in and own task 5 which is incomplete, **When** I toggle its completion, **Then** the task becomes complete.

2. **Given** I am logged in and own task 5 which is complete, **When** I toggle its completion, **Then** the task becomes incomplete.

3. **Given** I am logged in and task ID 999 does not exist, **When** I attempt to toggle it, **Then** I receive a not-found error.

4. **Given** I am logged in as User A and task 10 belongs to User B, **When** I attempt to toggle task 10, **Then** I receive a not-found error.

---

### Edge Cases

- **Empty task list**: System returns empty array, not error, when user has no tasks
- **Maximum title length**: Title is limited to 255 characters; longer titles receive validation error
- **Description optional**: Tasks can be created/updated without description (null or empty string)
- **Concurrent modifications**: Last write wins for simultaneous updates to same task
- **Deleted task access**: Attempting to view/update/delete an already-deleted task returns not-found
- **Invalid task ID format**: Non-integer task IDs return bad request error
- **JWT expiration**: Expired tokens return unauthorized; user must re-authenticate

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & Authorization

- **FR-001**: System MUST require valid JWT token in Authorization header for all task endpoints
- **FR-002**: System MUST return 401 Unauthorized when JWT is missing or invalid
- **FR-003**: System MUST extract user identity exclusively from JWT claims, never from request body or URL parameters

#### Ownership Enforcement

- **FR-004**: System MUST filter all task queries by authenticated user's ID
- **FR-005**: System MUST return 404 Not Found when user attempts to access another user's task (not revealing task existence)
- **FR-006**: System MUST NOT allow modification of task ownership (user_id field is immutable after creation)

#### Task Creation

- **FR-007**: System MUST allow authenticated users to create tasks with title and optional description
- **FR-008**: System MUST validate that task title is non-empty (minimum 1 character, maximum 255 characters)
- **FR-009**: System MUST automatically assign the authenticated user's ID as task owner
- **FR-010**: System MUST set new tasks to incomplete (completed=false) by default
- **FR-011**: System MUST generate timestamps (created_at, updated_at) automatically

#### Task Retrieval

- **FR-012**: System MUST allow authenticated users to list all their own tasks
- **FR-013**: System MUST allow authenticated users to retrieve a single task by ID (if owned)
- **FR-014**: System MUST include completion status indicator in task responses

#### Task Modification

- **FR-015**: System MUST allow authenticated users to update title and/or description of owned tasks
- **FR-016**: System MUST update the updated_at timestamp when task is modified
- **FR-017**: System MUST allow authenticated users to toggle completion status of owned tasks

#### Task Deletion

- **FR-018**: System MUST allow authenticated users to delete owned tasks
- **FR-019**: System MUST permanently remove deleted tasks from the database

#### Data Persistence

- **FR-020**: System MUST persist all task data to the database (no in-memory storage)
- **FR-021**: System MUST ensure tasks survive server restarts

#### Error Handling

- **FR-022**: System MUST return 400 Bad Request for invalid request payloads
- **FR-023**: System MUST return 401 Unauthorized for authentication failures
- **FR-024**: System MUST return 404 Not Found for non-existent or non-owned tasks
- **FR-025**: System MUST NOT expose internal error details in responses (500 errors must be generic)

### Key Entities

- **Task**: A work item owned by a user
  - Unique identifier (integer)
  - Owner reference (user ID from JWT)
  - Title (required, 1-255 characters)
  - Description (optional, text)
  - Completion status (boolean, defaults to false)
  - Creation timestamp
  - Last modification timestamp

- **User**: The authenticated entity (managed by Spec-1 Authentication)
  - Referenced by task ownership
  - Identity derived from JWT claims only

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated users can create a task in under 2 seconds
- **SC-002**: Authenticated users can view their complete task list in under 1 second
- **SC-003**: Authenticated users can update any owned task in under 2 seconds
- **SC-004**: Authenticated users can delete any owned task in under 2 seconds
- **SC-005**: Authenticated users can toggle task completion in under 1 second
- **SC-006**: 100% of unauthenticated requests are rejected with appropriate error
- **SC-007**: 100% of cross-user access attempts are blocked (return 404)
- **SC-008**: 0 tasks are lost after server restart (data persistence verified)
- **SC-009**: All task operations complete successfully for 100 concurrent authenticated users
- **SC-010**: Error responses contain no internal implementation details or stack traces

## Assumptions

- Authentication system (Spec-1) is fully implemented and operational
- JWT tokens contain user ID in claims accessible by backend
- Database (Neon PostgreSQL) is provisioned and accessible
- HTTPS transport is configured for secure token transmission
- No pagination required for task lists (future enhancement if needed)
- No sorting/filtering required for task lists (out of scope per constitution)
