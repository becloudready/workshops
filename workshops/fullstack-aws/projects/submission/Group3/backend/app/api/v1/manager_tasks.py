from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_manager
from app.models.user import User
from app.schemas.task import (
    SubtaskCreate,
    SubtaskOut,
    SubtaskUpdate,
    TaskCreate,
    TaskDetailOut,
    TaskOut,
    TaskUpdate,
)
from app.services.task_service import TaskService


router = APIRouter(
    prefix="/manager/tasks",
    tags=["manager-tasks"],
)

subtask_router = APIRouter(
    prefix="/manager/subtasks",
    tags=["manager-tasks"],
)


# ============================================================
# TASK -> RESPONSE
# ============================================================

def _to_task_out(task) -> TaskOut:
    return TaskOut(
        id=task.id,
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        urgency=task.urgency,

        # Cohort information
        cohort_id=task.cohort_id,
        cohort=(
            {
                "id": task.cohort.id,
                "name": task.cohort.name,
            }
            if task.cohort
            else None
        ),

        assigned_trainee_count=len(task.assignments),
    )


# ============================================================
# CREATE TASK
# ============================================================

@router.post(
    "",
    response_model=TaskOut,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> TaskOut:

    task = TaskService(db).create_task(
        manager.id,
        payload,
    )

    return _to_task_out(task)


# ============================================================
# LIST MANAGER TASKS
# ============================================================

@router.get(
    "",
    response_model=list[TaskOut],
)
def list_tasks(
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> list[TaskOut]:

    tasks = TaskService(db).list_manager_tasks(
        manager.id,
    )

    return [
        _to_task_out(task)
        for task in tasks
    ]


# ============================================================
# GET SINGLE TASK
# ============================================================

@router.get(
    "/{task_id}",
    response_model=TaskDetailOut,
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> TaskDetailOut:

    service = TaskService(db)

    task = service.get_owned_task(
        manager.id,
        task_id,
    )

    subtasks = service.subtasks.list_by_task(
        task_id,
    )

    return TaskDetailOut(
        id=task.id,
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        urgency=task.urgency,

        # Cohort information
        cohort_id=task.cohort_id,
        cohort=(
            {
                "id": task.cohort.id,
                "name": task.cohort.name,
            }
            if task.cohort
            else None
        ),

        subtasks=[
            SubtaskOut(
                id=subtask.id,
                title=subtask.title,
                order_index=subtask.order_index,
            )
            for subtask in subtasks
        ],
    )


# ============================================================
# UPDATE TASK
# ============================================================

@router.put(
    "/{task_id}",
    response_model=TaskOut,
)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> TaskOut:

    task = TaskService(db).update_task(
        manager.id,
        task_id,
        payload,
    )

    return _to_task_out(task)


# ============================================================
# DELETE TASK
# ============================================================

@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> None:

    TaskService(db).delete_task(
        manager.id,
        task_id,
    )


# ============================================================
# ADD SUBTASK
# ============================================================

@router.post(
    "/{task_id}/subtasks",
    response_model=SubtaskOut,
    status_code=status.HTTP_201_CREATED,
)
def add_subtask(
    task_id: int,
    payload: SubtaskCreate,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> SubtaskOut:

    subtask = TaskService(db).add_subtask(
        manager.id,
        task_id,
        payload.title,
        payload.order_index,
    )

    return SubtaskOut(
        id=subtask.id,
        title=subtask.title,
        order_index=subtask.order_index,
    )


# ============================================================
# UPDATE SUBTASK
# ============================================================

@subtask_router.put(
    "/{subtask_id}",
    response_model=SubtaskOut,
)
def update_subtask(
    subtask_id: int,
    payload: SubtaskUpdate,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> SubtaskOut:

    service = TaskService(db)

    subtask = service.subtasks.get_by_id(
        subtask_id,
    )

    if subtask is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subtask not found",
        )

    # Make sure the manager owns the task this
    # subtask belongs to.
    service.get_owned_task(
        manager.id,
        subtask.task_id,
    )

    for field, value in payload.model_dump(
        exclude_unset=True,
    ).items():
        setattr(
            subtask,
            field,
            value,
        )

    db.commit()
    db.refresh(subtask)

    return SubtaskOut(
        id=subtask.id,
        title=subtask.title,
        order_index=subtask.order_index,
    )


# ============================================================
# DELETE SUBTASK
# ============================================================

@subtask_router.delete(
    "/{subtask_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_subtask(
    subtask_id: int,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> None:

    service = TaskService(db)

    subtask = service.subtasks.get_by_id(
        subtask_id,
    )

    if subtask is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subtask not found",
        )

    # Make sure the manager owns the task this
    # subtask belongs to.
    service.get_owned_task(
        manager.id,
        subtask.task_id,
    )

    service.subtasks.delete(
        subtask,
    )

    db.commit()
