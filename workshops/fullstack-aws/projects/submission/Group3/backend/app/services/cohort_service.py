from sqlalchemy.orm import Session, joinedload

from app.models.task import Task
from app.models.cohort import Cohort
from app.models.user import User

from app.repositories.progress_repository import ProgressRepository
from app.repositories.task_assignment_repository import TaskAssignmentRepository

from app.schemas.cohort import CohortCreate


class CohortService:
    def __init__(self, db: Session):
        self.db = db
        self.progress = ProgressRepository(db)
        self.assignments = TaskAssignmentRepository(db)

    # ============================================================
    # CREATE
    # ============================================================

    def create_cohort(
        self,
        manager_id: int,
        payload: CohortCreate,
    ) -> Cohort:

        cohort = Cohort(
            name=payload.name.strip(),
            description=(
                payload.description.strip()
                if payload.description
                else None
            ),
            manager_id=manager_id,
        )

        self.db.add(cohort)
        self.db.commit()
        self.db.refresh(cohort)

        return cohort

    # ============================================================
    # LIST
    # ============================================================

    def list_manager_cohorts(
        self,
        manager_id: int,
    ) -> list[Cohort]:

        return (
            self.db.query(Cohort)
            .options(
                joinedload(Cohort.trainees),
            )
            .filter(
                Cohort.manager_id == manager_id,
            )
            .all()
        )

    # ============================================================
    # GET
    # ============================================================

    def get_manager_cohort(
        self,
        manager_id: int,
        cohort_id: int,
    ) -> Cohort | None:

        return (
            self.db.query(Cohort)
            .options(
                joinedload(Cohort.trainees),
                joinedload(Cohort.tasks),
            )
            .filter(
                Cohort.id == cohort_id,
                Cohort.manager_id == manager_id,
            )
            .first()
        )

    # ============================================================
    # TRAINEE PROGRESS
    # ============================================================

    def get_trainee_progress(
        self,
        trainee_id: int,
        task_id: int,
    ) -> int:

        assignment = (
            self.assignments.get_by_task_and_trainee(
                task_id,
                trainee_id,
            )
        )

        if assignment is None:
            return 0

        return int(
            assignment.current_percentage or 0
        )

    # ============================================================
    # COHORT TASK AVERAGE
    # ============================================================

    def get_task_average_percentage(
        self,
        task_id: int,
    ) -> float:

        assignments = self.assignments.list_by_task(
            task_id,
        )

        if not assignments:
            return 0.0

        total = sum(
            int(assignment.current_percentage or 0)
            for assignment in assignments
        )

        return round(
            total / len(assignments),
            1,
        )

    # ============================================================
    # COHORT TRAINEE AVERAGE
    # ============================================================

    def get_cohort_trainee_percentage(
        self,
        trainee_id: int,
        tasks,
    ) -> int:

        if not tasks:
            return 0

        percentages = []

        for task in tasks:
            assignment = (
                self.assignments.get_by_task_and_trainee(
                    task.id,
                    trainee_id,
                )
            )

            if assignment is not None:
                percentages.append(
                    int(
                        assignment.current_percentage or 0
                    )
                )

        if not percentages:
            return 0

        return round(
            sum(percentages) / len(percentages)
        )

    # ============================================================
    # DELETE
    # ============================================================

    def delete_cohort(
        self,
        manager_id: int,
        cohort_id: int,
    ) -> bool:

        cohort = (
            self.db.query(Cohort)
            .filter(
                Cohort.id == cohort_id,
                Cohort.manager_id == manager_id,
            )
            .first()
        )

        if cohort is None:
            return False

        # --------------------------------------------------------
        # Remove trainees from the cohort.
        #
        # Trainees are NOT deleted.
        # Their cohort_id is simply cleared.
        # --------------------------------------------------------

        self.db.query(User).filter(
            User.cohort_id == cohort.id,
        ).update(
            {
                User.cohort_id: None,
            },
            synchronize_session=False,
        )

        # --------------------------------------------------------
        # Remove tasks from the cohort.
        #
        # Tasks are NOT deleted.
        # Their cohort_id is simply cleared.
        # --------------------------------------------------------

        self.db.query(Task).filter(
            Task.cohort_id == cohort.id,
        ).update(
            {
                Task.cohort_id: None,
            },
            synchronize_session=False,
        )

        # --------------------------------------------------------
        # Delete the cohort
        # --------------------------------------------------------

        self.db.delete(cohort)
        self.db.commit()

        return True
