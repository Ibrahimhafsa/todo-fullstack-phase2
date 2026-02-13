# Skill: database-schema-guardian

## Purpose
Validate SQLModel implementations against database specs, ensure proper indexing (user_id, completed), verify foreign key relationships and cascade rules.

## Used By
- backend-expert
- spec-manager
- constitution-keeper

## Capabilities

### 1. Schema Validation
- Compare SQLModel definitions to spec
- Verify column types and constraints
- Check nullable/required fields
- Validate default values

### 2. Index Optimization
- Ensure user_id is indexed (required for isolation)
- Verify completed field is indexed (for filtering)
- Check composite indexes for common queries
- Identify missing performance indexes

### 3. Relationship Verification
- Validate foreign key definitions
- Check cascade delete rules
- Verify back_populates consistency
- Ensure referential integrity

### 4. Migration Safety
- Review migration scripts
- Check for data loss risks
- Validate rollback procedures
- Ensure backward compatibility

## Required Indexes

### Task Table
```python
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)  # REQUIRED
    title: str = Field(max_length=255)
    description: Optional[str] = None
    completed: bool = Field(default=False, index=True)  # REQUIRED
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Composite index for common query: user's incomplete tasks
    __table_args__ = (
        Index('ix_task_user_completed', 'user_id', 'completed'),
    )
```

## Schema Validation Checklist

### Required Fields
- [ ] Primary key (id) with auto-increment
- [ ] user_id with foreign key constraint
- [ ] created_at timestamp
- [ ] updated_at timestamp

### Required Indexes
- [ ] user_id (for user isolation queries)
- [ ] completed (for filtering queries)
- [ ] Composite index (user_id, completed) for common queries

### Foreign Key Rules
- [ ] user_id references user.id
- [ ] ON DELETE CASCADE for user deletion
- [ ] Proper back_populates relationship

### Constraints
- [ ] NOT NULL on required fields
- [ ] Max length on string fields
- [ ] Default values where appropriate

## SQLModel Best Practices

### Correct Definition
```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    # ... other fields

    tasks: List["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional["User"] = Relationship(back_populates="tasks")
```

## Common Issues to Detect

### Missing Indexes
```python
# BAD: No index on user_id
user_id: int = Field(foreign_key="user.id")

# GOOD: Indexed for query performance
user_id: int = Field(foreign_key="user.id", index=True)
```

### Missing Cascade
```python
# BAD: Orphaned tasks when user deleted
user_id: int = Field(foreign_key="user.id")

# GOOD: Tasks deleted with user (handle in migration)
# Add ON DELETE CASCADE in migration SQL
```

### Missing Timestamps
```python
# BAD: No audit trail
class Task(SQLModel, table=True):
    id: int
    title: str

# GOOD: Full audit trail
class Task(SQLModel, table=True):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
```

## Migration Checklist

Before running migrations:
- [ ] Backup database
- [ ] Test migration on copy
- [ ] Verify rollback works
- [ ] Check for data loss
- [ ] Update related code first
