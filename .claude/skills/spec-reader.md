# Skill: spec-reader

## Purpose
Read and parse all Spec-Kit Plus files to extract requirements, acceptance criteria, API contracts, and technical specifications.

## Used By
- orchestrator
- spec-manager
- constitution-keeper
- backend-expert
- frontend-expert

## Capabilities

### 1. Specification Discovery
- Locate all spec files in `specs/<feature>/` directories
- Find constitution at `.specify/memory/constitution.md`
- Identify plan files (`plan.md`) and task files (`tasks.md`)
- Detect ADRs in `history/adr/`

### 2. Requirements Extraction
- Parse user stories and acceptance criteria
- Extract functional and non-functional requirements
- Identify dependencies between features
- Map requirements to implementation tasks

### 3. API Contract Parsing
- Extract endpoint definitions (method, path, request/response)
- Parse Pydantic model schemas
- Identify authentication requirements per endpoint
- Extract error response specifications

### 4. Technical Specification Analysis
- Parse database schema definitions
- Extract component specifications
- Identify integration points
- Map data flow requirements

## File Patterns

```
specs/<feature>/spec.md      # Feature specifications
specs/<feature>/plan.md      # Implementation plans
specs/<feature>/tasks.md     # Task breakdowns
.specify/memory/constitution.md  # Project principles
history/adr/*.md             # Architecture decisions
```

## Output Format

When reading specs, return structured data:
```yaml
feature: <feature-name>
requirements:
  - id: REQ-001
    description: ...
    acceptance_criteria: [...]
api_contracts:
  - endpoint: POST /api/tasks
    auth: required
    request_schema: ...
    response_schema: ...
database:
  tables: [...]
  indexes: [...]
```

## Usage Instructions

1. Start by reading the constitution for project-wide standards
2. Identify the relevant feature spec for the current task
3. Extract acceptance criteria to validate implementations
4. Cross-reference with plan.md for architectural decisions
5. Use tasks.md for implementation order and dependencies
