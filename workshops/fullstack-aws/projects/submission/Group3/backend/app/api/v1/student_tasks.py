from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_trainee
from app.models.user import User
from app.schemas.progress import (
    ProgressUpdateCreate,
    ProgressUpdateOut,
    StudentTaskDetail,
    StudentTaskListItem,
    SubtaskToggle,
    SubtaskToggleOut,
)
from app.services.progress_service import ProgressService


# ============================================================
# STUDENT / TRAINEE ENDPOINTS
#
# Base prefix: /student
#
# GET    /student/tasks
#        Get all tasks assigned to the current trainee.
#
# GET    /student/tasks/{task_id}
#        Get details for a specific task.
#
# PATCH  /student/subtasks/{subtask_id}
#        Toggle a subtask's completion status.
#
# POST   /student/tasks/{task_id}/progress
#        Submit a progress update for a task.
#
# GET    /student/tasks/{task_id}/progress/history
#        Get the progress history for a task.
#
# NOTE:
# The application may add an additional prefix such as
# /api/v1 when this router is included in main.py.
#
# Example:
# /api/v1/student/tasks
# ============================================================

router = APIRouter(prefix="/student", tags=["student"])


@router.get("/tasks", response_model=list[StudentTaskListItem])
def list_tasks(
    sort: str | None = Query(default=None),
    db: Session = Depends(get_db),
    trainee: User = Depends(get_current_trainee),
) -> list[dict]:
    return ProgressService(db).list_student_tasks(trainee.id, sort)


@router.get("/tasks/{task_id}", response_model=StudentTaskDetail)
def task_detail(
    task_id: int,
    db: Session = Depends(get_db),
    trainee: User = Depends(get_current_trainee),
) -> dict:
    return ProgressService(db).get_student_task_detail(trainee.id, task_id)


@router.patch("/subtasks/{subtask_id}", response_model=SubtaskToggleOut)
def toggle_subtask(
    subtask_id: int,
    payload: SubtaskToggle,
    db: Session = Depends(get_db),
    trainee: User = Depends(get_current_trainee),
) -> dict:
    return ProgressService(db).toggle_subtask(
        trainee.id,
        subtask_id,
        payload.is_completed,
    )


@router.post(
    "/tasks/{task_id}/progress",
    response_model=ProgressUpdateOut,
    status_code=status.HTTP_201_CREATED,
)
def submit_progress(
    task_id: int,
    payload: ProgressUpdateCreate,
    db: Session = Depends(get_db),
    trainee: User = Depends(get_current_trainee),
) -> dict:
    return ProgressService(db).submit_progress_update(
        trainee.id,
        task_id,
        payload.percentage,
        payload.comment,
    )


@router.get(
    "/tasks/{task_id}/progress/history",
    response_model=list[ProgressUpdateOut],
)
def progress_history(
    task_id: int,
    db: Session = Depends(get_db),
    trainee: User = Depends(get_current_trainee),
) -> list[ProgressUpdateOut]:
    history = ProgressService(db).get_progress_history(trainee.id, task_id)
    return [ProgressUpdateOut(task_id=task_id, **entry) for entry in history]
