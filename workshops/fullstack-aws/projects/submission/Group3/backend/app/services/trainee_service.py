from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.security import hash_password
from app.models.cohort import Cohort
from app.models.enums import UserRole
from app.models.task import Task
from app.models.user import User
from app.models.task_assignment import TaskAssignment
from app.schemas.trainee import TraineeCreate, TraineeUpdate


class TraineeService:

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # LIST
    # ========================================================

    def list_manager_trainees(
        self,
        manager_id: int,
    ) -> list[User]:

        return (
            self.db.query(User)
            .filter(
                User.manager_id == manager_id,
                User.role == UserRole.trainee,
            )
            .options(
                joinedload(User.cohort),
            )
            .order_by(User.full_name)
            .all()
        )

    # ========================================================
    # GET
    # ========================================================

    def get_manager_trainee(
        self,
        manager_id: int,
        trainee_id: int,
    ) -> User | None:

        return (
            self.db.query(User)
            .filter(
                User.id == trainee_id,
                User.manager_id == manager_id,
                User.role == UserRole.trainee,
            )
            .options(
                joinedload(User.cohort),
                joinedload(User.task_assignments).joinedload(
                    TaskAssignment.task
                ),
            )
            .first()
        )

    # ========================================================
    # CREATE
    # ========================================================

    def create_trainee(
        self,
        manager_id: int,
        payload: TraineeCreate,
    ) -> User:

        # ----------------------------------------------------
        # Normalize email
        # ----------------------------------------------------

        email = payload.email.strip().lower()

        # ----------------------------------------------------
        # Check for existing email
        # ----------------------------------------------------

        existing_user = (
            self.db.query(User)
            .filter(
                User.email == email,
            )
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email already exists.",
            )

        # ----------------------------------------------------
        # Validate cohort
        #
        # A trainee may be created without a cohort.
        #
        # If a cohort is supplied, it must belong to the
        # current manager.
        # ----------------------------------------------------

        cohort_id = payload.cohort_id

        if cohort_id is not None:

            cohort = (
                self.db.query(Cohort)
                .filter(
                    Cohort.id == cohort_id,
                    Cohort.manager_id == manager_id,
                )
                .first()
            )

            if cohort is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cohort not found.",
                )

        # ----------------------------------------------------
        # Create trainee
        # ----------------------------------------------------

        trainee = User(
            full_name=payload.full_name.strip(),
            email=email,
            hashed_password=hash_password(payload.password),
            role=UserRole.trainee,

            # Manager owns the trainee directly.
            manager_id=manager_id,

            # Can be NULL.
            cohort_id=cohort_id,
        )

        self.db.add(trainee)

        # We need trainee.id before creating assignments.
        self.db.flush()

        # ----------------------------------------------------
        # ASSIGN COHORT TASKS
        #
        # If a cohort was selected, create one
        # TaskAssignment for every task belonging to it.
        # ----------------------------------------------------

        if cohort_id is not None:

            cohort_tasks = (
                self.db.query(Task)
                .filter(
                    Task.cohort_id == cohort_id,
                )
                .all()
            )

            for task in cohort_tasks:

                assignment = TaskAssignment(
                    task_id=task.id,
                    trainee_id=trainee.id,
                    current_percentage=0,
                )

                self.db.add(assignment)

        # ----------------------------------------------------
        # Commit everything together
        # ----------------------------------------------------

        self.db.commit()

        self.db.refresh(trainee)

        return trainee

    # ========================================================
    # UPDATE
    # ========================================================

    def update_trainee(
        self,
        manager_id: int,
        trainee_id: int,
        payload: TraineeUpdate,
    ) -> User | None:

        # ----------------------------------------------------
        # Find trainee belonging to this manager
        #
        # manager_id is the source of truth for ownership.
        # ----------------------------------------------------

        trainee = (
            self.db.query(User)
            .filter(
                User.id == trainee_id,
                User.manager_id == manager_id,
                User.role == UserRole.trainee,
            )
            .first()
        )

        if trainee is None:
            return None

        # ----------------------------------------------------
        # Get supplied fields
        # ----------------------------------------------------

        update_data = payload.model_dump(
            exclude_unset=True,
        )

        # ----------------------------------------------------
        # Normalize email
        # ----------------------------------------------------

        if "email" in update_data:

            if update_data["email"] is not None:

                email = update_data["email"].strip().lower()

                existing_user = (
                    self.db.query(User)
                    .filter(
                        User.email == email,
                        User.id != trainee_id,
                    )
                    .first()
                )

                if existing_user:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="A user with this email already exists.",
                    )

                update_data["email"] = email

        # ----------------------------------------------------
        # Normalize full name
        # ----------------------------------------------------

        if "full_name" in update_data:

            if update_data["full_name"] is not None:

                update_data["full_name"] = (
                    update_data["full_name"].strip()
                )

        # ----------------------------------------------------
        # COHORT CHANGE
        #
        # None is allowed.
        #
        # Examples:
        #
        #   None -> Cohort A
        #   Cohort A -> Cohort B
        #   Cohort A -> None
        #
        # When assigning/changing to a cohort, all tasks from
        # the new cohort are assigned to the trainee.
        #
        # When removing/changing cohort, existing task
        # assignments are removed.
        # ----------------------------------------------------

        cohort_changed = "cohort_id" in update_data

        old_cohort_id = trainee.cohort_id
        new_cohort_id = update_data.get(
            "cohort_id",
            old_cohort_id,
        )

        if cohort_changed:

            # ------------------------------------------------
            # Validate new cohort
            # ------------------------------------------------

            if new_cohort_id is not None:

                cohort = (
                    self.db.query(Cohort)
                    .filter(
                        Cohort.id == new_cohort_id,
                        Cohort.manager_id == manager_id,
                    )
                    .first()
                )

                if cohort is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Cohort not found.",
                    )

            # ------------------------------------------------
            # Only do task reassignment if the cohort actually
            # changed.
            # ------------------------------------------------

            if old_cohort_id != new_cohort_id:

                # --------------------------------------------
                # Remove existing task assignments.
                #
                # This means the trainee's task list always
                # matches their current cohort.
                # --------------------------------------------

                self.db.query(TaskAssignment).filter(
                    TaskAssignment.trainee_id == trainee.id,
                ).delete(
                    synchronize_session=False,
                )

                # --------------------------------------------
                # Assign all tasks from the new cohort.
                #
                # If new_cohort_id is None, no tasks are added.
                # --------------------------------------------

                if new_cohort_id is not None:

                    cohort_tasks = (
                        self.db.query(Task)
                        .filter(
                            Task.cohort_id == new_cohort_id,
                        )
                        .all()
                    )

                    for task in cohort_tasks:

                        assignment = TaskAssignment(
                            task_id=task.id,
                            trainee_id=trainee.id,
                            current_percentage=0,
                        )

                        self.db.add(assignment)

        # ----------------------------------------------------
        # Apply normal trainee updates
        # ----------------------------------------------------

        for field, value in update_data.items():

            setattr(
                trainee,
                field,
                value,
            )

        # ----------------------------------------------------
        # Commit
        # ----------------------------------------------------

        self.db.commit()

        self.db.refresh(trainee)

        return trainee

    # ========================================================
    # DELETE
    # ========================================================

    def delete_trainee(
        self,
        manager_id: int,
        trainee_id: int,
    ) -> bool:

        # ----------------------------------------------------
        # Find trainee belonging to this manager
        #
        # Do not use cohort_id because it may be NULL.
        # ----------------------------------------------------

        trainee = (
            self.db.query(User)
            .filter(
                User.id == trainee_id,
                User.manager_id == manager_id,
                User.role == UserRole.trainee,
            )
            .first()
        )

        if trainee is None:
            return False

        # ----------------------------------------------------
        # Delete trainee
        # ----------------------------------------------------

        self.db.delete(trainee)

        self.db.commit()

        return True