# Skill: spec-writer

## Purpose
Create detailed specifications with UI/UX requirements, API contracts, acceptance criteria, and database schemas following Spec-Kit Plus conventions.

## Used By
- spec-manager

## Capabilities

### 1. Feature Specification Creation
- Generate comprehensive spec.md files
- Define user stories with acceptance criteria
- Document edge cases and error scenarios
- Specify non-functional requirements

### 2. UI/UX Requirements Documentation
- Define component hierarchy and layout
- Specify responsive breakpoints
- Document accessibility requirements (ARIA)
- Define interaction patterns and animations

### 3. API Contract Definition
- Define RESTful endpoint specifications
- Create request/response schemas
- Document authentication requirements
- Specify error response formats

### 4. Database Schema Design
- Define table structures with SQLModel
- Specify indexes for query optimization
- Document relationships and constraints
- Plan migration strategies

## Spec-Kit Plus Structure

### Feature Spec Template
```markdown
# Feature: <feature-name>

## Overview
Brief description of the feature.

## User Stories
- As a [user], I want to [action] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## API Endpoints

### POST /api/<resource>
- **Auth**: Required (JWT)
- **Request Body**: { ... }
- **Response**: { ... }
- **Errors**: 400, 401, 404

## Database Schema
```sql
CREATE TABLE ...
```

## UI Components
- Component hierarchy
- Responsive requirements
- Accessibility notes

## Non-Functional Requirements
- Performance targets
- Security requirements
- Scalability considerations
```

## Quality Checklist

Before finalizing a spec:
- [ ] All user stories have acceptance criteria
- [ ] API contracts include all CRUD operations
- [ ] Database schema includes required indexes
- [ ] Error scenarios are documented
- [ ] Security requirements are explicit
- [ ] UI accessibility requirements defined

## Output Locations

```
specs/<feature>/spec.md   # Main specification
specs/<feature>/plan.md   # Generated after spec approval
specs/<feature>/tasks.md  # Generated from plan
```
