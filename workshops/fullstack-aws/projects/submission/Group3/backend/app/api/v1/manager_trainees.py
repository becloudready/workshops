from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_manager
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.trainee import (
    TraineeCreate,
    TraineeListItem,
    TraineeOut,
    TraineeUpdate,
    TraineeTaskOut,
    TraineeCohortOut,
)
from app.services.trainee_service import TraineeService


router = APIRouter(
    prefix="/manager/trainees",
    tags=["manager-trainees"],
)


# ============================================================
# HELPERS
# ============================================================

def _to_trainee_list_item(trainee: User) -> TraineeListItem:
    return TraineeListItem(
        id=trainee.id,
        full_name=trainee.full_name,
        email=trainee.email,
        cohort=(
            TraineeCohortOut(
                id=trainee.cohort.id,
                name=trainee.cohort.name,
            )
            if trainee.cohort
            else None
        ),
    )


def _to_trainee_out(trainee: User) -> TraineeOut:
    tasks = []

    for assignment in trainee.task_assignments:
        task = assignment.task

        tasks.append(
            TraineeTaskOut(
                id=task.id,
                title=task.title,
                description=task.description,
                due_date=task.due_date,
                urgency=task.urgency,
                current_percentage=assignment.current_percentage,
            )
        )

    return TraineeOut(
        id=trainee.id,
        full_name=trainee.full_name,
        email=trainee.email,
        cohort=(
            TraineeCohortOut(
                id=trainee.cohort.id,
                name=trainee.cohort.name,
            )
            if trainee.cohort
            else None
        ),
        tasks=tasks,
    )


# ============================================================
# LIST TRAINEES
# ============================================================

@router.get(
    "",
    response_model=list[TraineeListItem],
)
def list_trainees(
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> list[TraineeListItem]:

    trainees = TraineeService(db).list_manager_trainees(
        manager.id,
    )

    return [
        _to_trainee_list_item(trainee)
        for trainee in trainees
    ]


# ============================================================
# GET TRAINEE
# ============================================================

@router.get(
    "/{trainee_id}",
    response_model=TraineeOut,
)
def get_trainee(
    trainee_id: int,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> TraineeOut:

    trainee = TraineeService(db).get_manager_trainee(
        manager.id,
        trainee_id,
    )

    if trainee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainee not found",
        )

    return _to_trainee_out(trainee)


# ============================================================
# CREATE TRAINEE
# ============================================================

@router.post(
    "",
    response_model=TraineeOut,
    status_code=status.HTTP_201_CREATED,
)
def create_trainee(
    payload: TraineeCreate,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> TraineeOut:

    trainee = TraineeService(db).create_trainee(
        manager.id,
        payload,
    )

    return _to_trainee_out(trainee)


# ============================================================
# UPDATE TRAINEE
# ============================================================

@router.put(
    "/{trainee_id}",
    response_model=TraineeOut,
)
def update_trainee(
    trainee_id: int,
    payload: TraineeUpdate,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> TraineeOut:

    trainee = TraineeService(db).update_trainee(
        manager.id,
        trainee_id,
        payload,
    )

    if trainee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainee not found",
        )

    return _to_trainee_out(trainee)

# ============================================================
# DELETE TRAINEE
# ============================================================

@router.delete(
    "/{trainee_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_trainee(
    trainee_id: int,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> None:

    deleted = TraineeService(db).delete_trainee(
        manager.id,
        trainee_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainee not found",
        )

    return None
