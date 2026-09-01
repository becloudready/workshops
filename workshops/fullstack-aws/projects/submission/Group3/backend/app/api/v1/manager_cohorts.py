from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_manager
from app.models.user import User
from app.schemas.cohort import (
    CohortCreate,
    CohortDetailOut,
    CohortOut,
    CohortTaskOut,
    CohortTraineeOut,
)
from app.services.cohort_service import CohortService


router = APIRouter(
    prefix="/manager/cohorts",
    tags=["manager-cohorts"],
)


# ============================================================
# CREATE COHORT
# ============================================================

@router.post(
    "",
    response_model=CohortOut,
    status_code=status.HTTP_201_CREATED,
)
def create_cohort(
    payload: CohortCreate,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> CohortOut:

    cohort = CohortService(db).create_cohort(
        manager.id,
        payload,
    )

    return CohortOut(
        id=cohort.id,
        name=cohort.name,
        description=cohort.description,
        trainee_count=0,
    )


# ============================================================
# LIST COHORTS
# ============================================================

@router.get(
    "",
    response_model=list[CohortOut],
)
def list_cohorts(
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> list[CohortOut]:

    cohorts = CohortService(db).list_manager_cohorts(
        manager.id,
    )

    return [
        CohortOut(
            id=cohort.id,
            name=cohort.name,
            description=cohort.description,
            trainee_count=len(cohort.trainees),
        )
        for cohort in cohorts
    ]


# ============================================================
# GET COHORT
# ============================================================

@router.get(
    "/{cohort_id}",
    response_model=CohortDetailOut,
)
def get_cohort(
    cohort_id: int,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> CohortDetailOut:

    service = CohortService(db)

    cohort = service.get_manager_cohort(
        manager.id,
        cohort_id,
    )

    if cohort is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cohort not found",
        )

    trainees = [
        CohortTraineeOut(
            id=trainee.id,
            full_name=trainee.full_name,
            email=trainee.email,
            current_percentage=0,
        )
        for trainee in cohort.trainees
    ]

    return CohortDetailOut(
        id=cohort.id,
        name=cohort.name,
        description=cohort.description,
        trainees=trainees,
        tasks=[
            CohortTaskOut(
                id=task.id,
                title=task.title,
                description=task.description,
                due_date=task.due_date,
                urgency=task.urgency,
            )
            for task in cohort.tasks
        ],
    )

# ============================================================
# DELETE COHORT
# ============================================================

@router.delete(
    "/{cohort_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_cohort(
    cohort_id: int,
    db: Session = Depends(get_db),
    manager: User = Depends(get_current_manager),
) -> None:

    deleted = CohortService(db).delete_cohort(
        manager.id,
        cohort_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cohort not found",
        )

    return None
