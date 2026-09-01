from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_manager
from app.models.user import User
from app.schemas.task import TaskProgressOut, TraineeProgressDetailOut
from app.services.task_service import TaskService

router = APIRouter(prefix="/manager/tasks", tags=["manager-progress"])


@router.get("/{task_id}/progress", response_model=TaskProgressOut)
def task_progress(
    task_id: int, db: Session = Depends(get_db), manager: User = Depends(get_current_manager)
) -> dict:
    return TaskService(db).get_task_progress_summary(manager.id, task_id)


@router.get("/{task_id}/progress/{trainee_id}", response_model=TraineeProgressDetailOut)
def trainee_progress(
    task_id: int,
    trainee_id: int,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> dict:
    return TaskService(db).get_trainee_progress_detail(manager.id, task_id, trainee_id)
