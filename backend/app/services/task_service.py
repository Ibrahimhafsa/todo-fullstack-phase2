"""Task CRUD service layer with ownership enforcement."""
from datetime import datetime
from typing import Optional

from sqlmodel import Session, select

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


def create_task(session: Session, user_id: str, data: TaskCreate) -> Task:
    """
    Create a new task for the authenticated user.
    
    FR-007: Create tasks with title and optional description
    FR-009: Automatically assign authenticated user's ID as owner
    FR-010: Set is_complete to false by default
    FR-011: Generate timestamps automatically
    
    Args:
        session: Database session
        user_id: Authenticated user's ID from JWT (NOT from request!)
        data: Task creation data
        
    Returns:
        Created Task instance
    """
    task = Task(
        user_id=user_id,
        title=data.title,
        description=data.description,
        # is_complete defaults to False in model
        # timestamps default to utcnow() in model
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def list_tasks(session: Session, user_id: str) -> list[Task]:
    """
    List all tasks for the authenticated user.
    
    FR-012: List all own tasks
    FR-004: Filter by authenticated user's ID (Constitution VII)
    
    Args:
        session: Database session
        user_id: Authenticated user's ID from JWT
        
    Returns:
        List of tasks owned by the user
    """
    statement = select(Task).where(Task.user_id == user_id)
    return list(session.exec(statement).all())


def get_task(session: Session, user_id: str, task_id: int) -> Optional[Task]:
    """
    Get a single task by ID if owned by the user.
    
    FR-013: Retrieve single task by ID
    FR-004, FR-005: Filter by user_id, return None for non-owned
    
    Args:
        session: Database session
        user_id: Authenticated user's ID from JWT
        task_id: Task ID to retrieve
        
    Returns:
        Task if found and owned, None otherwise
    """
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id
    )
    return session.exec(statement).first()


def update_task(
    session: Session,
    user_id: str,
    task_id: int,
    data: TaskUpdate
) -> Optional[Task]:
    """
    Update task title and/or description.
    
    FR-015: Update title/description of owned tasks
    FR-016: Update updated_at timestamp
    FR-006: Cannot modify user_id (not in TaskUpdate schema)
    
    Args:
        session: Database session
        user_id: Authenticated user's ID from JWT
        task_id: Task ID to update
        data: Update data
        
    Returns:
        Updated Task if found and owned, None otherwise
    """
    task = get_task(session, user_id, task_id)
    if not task:
        return None
    
    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description
    
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def delete_task(session: Session, user_id: str, task_id: int) -> bool:
    """
    Delete a task if owned by the user.
    
    FR-018: Delete owned tasks
    FR-019: Permanently remove from database
    
    Args:
        session: Database session
        user_id: Authenticated user's ID from JWT
        task_id: Task ID to delete
        
    Returns:
        True if deleted, False if not found or not owned
    """
    task = get_task(session, user_id, task_id)
    if not task:
        return False
    
    session.delete(task)
    session.commit()
    return True


def toggle_complete(session: Session, user_id: str, task_id: int) -> Optional[Task]:
    """
    Toggle task completion status.
    
    FR-017: Toggle is_complete status
    FR-016: Update updated_at timestamp
    
    Args:
        session: Database session
        user_id: Authenticated user's ID from JWT
        task_id: Task ID to toggle
        
    Returns:
        Updated Task if found and owned, None otherwise
    """
    task = get_task(session, user_id, task_id)
    if not task:
        return None
    
    task.is_complete = not task.is_complete
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
