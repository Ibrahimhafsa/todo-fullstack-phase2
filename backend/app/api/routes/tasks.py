"""Task API endpoints with ownership enforcement."""
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from app.core.deps import get_current_user, get_db
from app.schemas.task import (
    TaskCreate,
    TaskListResponse,
    TaskResponse,
    TaskUpdate,
)
from app.services import task_service

router = APIRouter(prefix="/api", tags=["tasks"])


def _verify_ownership(path_user_id: str, current_user_id: int) -> None:
    """
    Verify path user_id matches authenticated user.

    Constitution VII: Never trust path parameter alone
    FR-005: Return 404 for non-owned access (don't reveal existence)
    """
    if int(path_user_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )


# T012: POST /api/{user_id}/tasks - Create task
@router.post(
    "/{user_id}/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(
    user_id: str,
    data: TaskCreate,
    current_user_id: int = Depends(get_current_user),
    session: Session = Depends(get_db)
) -> TaskResponse:
    """
    Create a new task for the authenticated user.

    US1: Create Task
    FR-007 through FR-011
    """
    _verify_ownership(user_id, current_user_id)
    task = task_service.create_task(session, str(current_user_id), data)
    return TaskResponse.model_validate(task)


# T016: GET /api/{user_id}/tasks - List tasks
@router.get("/{user_id}/tasks", response_model=TaskListResponse)
def list_tasks(
    user_id: str,
    current_user_id: int = Depends(get_current_user),
    session: Session = Depends(get_db)
) -> TaskListResponse:
    """
    List all tasks for the authenticated user.

    US2: View Task List
    FR-012, FR-014
    """
    _verify_ownership(user_id, current_user_id)
    tasks = task_service.list_tasks(session, str(current_user_id))
    return TaskListResponse(
        tasks=[TaskResponse.model_validate(t) for t in tasks],
        count=len(tasks)
    )


# T018: GET /api/{user_id}/tasks/{task_id} - Get single task
@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    user_id: str,
    task_id: int,
    current_user_id: int = Depends(get_current_user),
    session: Session = Depends(get_db)
) -> TaskResponse:
    """
    Get details of a specific task.

    US3: View Single Task
    FR-013, FR-024
    """
    _verify_ownership(user_id, current_user_id)
    task = task_service.get_task(session, str(current_user_id), task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return TaskResponse.model_validate(task)


# T020: PUT /api/{user_id}/tasks/{task_id} - Update task
@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    user_id: str,
    task_id: int,
    data: TaskUpdate,
    current_user_id: int = Depends(get_current_user),
    session: Session = Depends(get_db)
) -> TaskResponse:
    """
    Update task title and/or description.

    US4: Update Task
    FR-015, FR-016, FR-022, FR-024
    """
    _verify_ownership(user_id, current_user_id)
    task = task_service.update_task(session, str(current_user_id), task_id, data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return TaskResponse.model_validate(task)


# T022: DELETE /api/{user_id}/tasks/{task_id} - Delete task
@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: str,
    task_id: int,
    current_user_id: int = Depends(get_current_user),
    session: Session = Depends(get_db)
) -> Response:
    """
    Delete a task.

    US5: Delete Task
    FR-018, FR-019, FR-024
    """
    _verify_ownership(user_id, current_user_id)
    deleted = task_service.delete_task(session, str(current_user_id), task_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# T024: PATCH /api/{user_id}/tasks/{task_id}/complete - Toggle completion
@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_complete(
    user_id: str,
    task_id: int,
    current_user_id: int = Depends(get_current_user),
    session: Session = Depends(get_db)
) -> TaskResponse:
    """
    Toggle task completion status.

    US6: Toggle Task Completion
    FR-017, FR-024
    """
    _verify_ownership(user_id, current_user_id)
    task = task_service.toggle_complete(session, str(current_user_id), task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return TaskResponse.model_validate(task)
