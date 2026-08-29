"""Seeds a clean development database.

This script deletes all existing application data and then creates:

- 1 manager
- 1 cohort
- 2 trainees
- 2 tasks
- 6 subtasks
- Task assignments for both trainees

Run from the backend/ directory:

    python -m scripts.seed_dev_data

WARNING:
    This permanently deletes all data in the development database.
    Do NOT use this script against a production database.
"""

from datetime import datetime, timedelta, timezone

from app.core.database import SessionLocal
from app.core.security import hash_password

from app.models.cohort import Cohort
from app.models.enums import UserRole, UrgencyLevel
from app.models.user import User
from app.models.task import Task
from app.models.subtask import Subtask
from app.models.task_assignment import TaskAssignment
from app.models.subtask_completion import SubtaskCompletion
from app.models.progress_update import ProgressUpdate


def clear_database(db) -> None:
    """Delete all application data in dependency-safe order."""

    print("Clearing existing development data...")

    # ========================================================
    # BREAK USER <-> COHORT FOREIGN KEY CYCLE
    #
    # users.cohort_id    -> cohorts.id
    # cohorts.manager_id -> users.id
    #
    # We first remove those references so PostgreSQL allows
    # us to delete the records.
    # ========================================================

    db.execute(
        User.__table__.update().values(
            manager_id=None,
            cohort_id=None,
        )
    )

    db.execute(
        Cohort.__table__.update().values(
            manager_id=None,
        )
    )

    # ========================================================
    # CHILD TABLES
    # ========================================================

    db.query(ProgressUpdate).delete(
        synchronize_session=False
    )

    db.query(SubtaskCompletion).delete(
        synchronize_session=False
    )

    db.query(TaskAssignment).delete(
        synchronize_session=False
    )

    db.query(Subtask).delete(
        synchronize_session=False
    )

    db.query(Task).delete(
        synchronize_session=False
    )

    # ========================================================
    # COHORTS
    # ========================================================

    db.query(Cohort).delete(
        synchronize_session=False
    )

    # ========================================================
    # USERS
    # ========================================================

    db.query(User).delete(
        synchronize_session=False
    )

    db.commit()

    print("Database cleared.")


def seed_database(db) -> None:
    """Create development seed data."""

    # ========================================================
    # MANAGER
    # ========================================================

    manager = User(
        email="manager@noticeboardtracker.dev",
        hashed_password=hash_password("Manager123!"),
        full_name="Morgan Manager",
        role=UserRole.manager,
    )

    db.add(manager)
    db.flush()

    # ========================================================
    # COHORT
    # ========================================================

    cohort = Cohort(
        name="Cohort Alpha",
        description="Test cohort",
        manager_id=manager.id,
    )

    db.add(cohort)
    db.flush()

    # ========================================================
    # TRAINEES
    # ========================================================

    trainees = [
        User(
            email=f"trainee{i}@noticeboardtracker.dev",
            hashed_password=hash_password("Trainee123!"),
            full_name=f"Trainee {i}",
            role=UserRole.trainee,
            manager_id=manager.id,
            cohort_id=cohort.id,
        )
        for i in range(1, 3)
    ]

    db.add_all(trainees)
    db.flush()

    # ========================================================
    # TASK 1
    # ========================================================

    task1 = Task(
        title="Complete Python Onboarding",
        description=(
            "Complete the initial Python training and demonstrate "
            "understanding of the core concepts."
        ),
        created_by=manager.id,
        cohort_id=cohort.id,
        due_date=datetime.now(timezone.utc) + timedelta(days=7),
        urgency=UrgencyLevel.medium,
    )

    db.add(task1)
    db.flush()

    # ========================================================
    # TASK 1 SUBTASKS
    # ========================================================

    task1_subtasks = [
        Subtask(
            task_id=task1.id,
            title="Review Python syntax and data types",
            order_index=1,
        ),
        Subtask(
            task_id=task1.id,
            title="Complete Python functions exercise",
            order_index=2,
        ),
        Subtask(
            task_id=task1.id,
            title="Complete Python classes exercise",
            order_index=3,
        ),
    ]

    db.add_all(task1_subtasks)
    db.flush()

    # ========================================================
    # TASK 2
    # ========================================================

    task2 = Task(
        title="Build Noticeboard API Feature",
        description=(
            "Implement a small API feature using FastAPI and "
            "SQLAlchemy."
        ),
        created_by=manager.id,
        cohort_id=cohort.id,
        due_date=datetime.now(timezone.utc) + timedelta(days=14),
        urgency=UrgencyLevel.high,
    )

    db.add(task2)
    db.flush()

    # ========================================================
    # TASK 2 SUBTASKS
    # ========================================================

    task2_subtasks = [
        Subtask(
            task_id=task2.id,
            title="Create the database model",
            order_index=1,
        ),
        Subtask(
            task_id=task2.id,
            title="Create the repository and service",
            order_index=2,
        ),
        Subtask(
            task_id=task2.id,
            title="Create and test the API endpoint",
            order_index=3,
        ),
    ]

    db.add_all(task2_subtasks)
    db.flush()

    # ========================================================
    # TASK ASSIGNMENTS
    #
    # Both tasks are assigned to both trainees.
    # ========================================================

    assignments = []

    for trainee in trainees:
        assignments.append(
            TaskAssignment(
                task_id=task1.id,
                trainee_id=trainee.id,
                current_percentage=0,
            )
        )

        assignments.append(
            TaskAssignment(
                task_id=task2.id,
                trainee_id=trainee.id,
                current_percentage=0,
            )
        )

    db.add_all(assignments)
    db.flush()

    # ========================================================
    # OPTIONAL SAMPLE PROGRESS
    #
    # Give Trainee 1 some progress so the manager dashboard
    # has meaningful data immediately after seeding.
    # ========================================================

    trainee1 = trainees[0]

    task1_assignment = next(
        assignment
        for assignment in assignments
        if assignment.task_id == task1.id
        and assignment.trainee_id == trainee1.id
    )

    task1_assignment.current_percentage = 33
    task1_assignment.last_updated_at = datetime.now(timezone.utc)

    # Mark the first subtask complete for Trainee 1.

    db.add(
        SubtaskCompletion(
            subtask_id=task1_subtasks[0].id,
            trainee_id=trainee1.id,
            is_completed=True,
            completed_at=datetime.now(timezone.utc),
        )
    )

    # Add a progress history record.

    db.add(
        ProgressUpdate(
            task_assignment_id=task1_assignment.id,
            percentage=33,
            comment="Completed the first onboarding section.",
        )
    )

    # ========================================================
    # COMMIT
    # ========================================================

    db.commit()

    # ========================================================
    # OUTPUT
    # ========================================================

    print()
    print("Seed complete!")
    print()

    print("Manager:")
    print(
        "  email    = manager@noticeboardtracker.dev"
    )
    print(
        "  password = Manager123!"
    )
    print(
        f"  id       = {manager.id}"
    )

    print()

    print("Cohort:")
    print(
        f"  name = {cohort.name}"
    )
    print(
        f"  id   = {cohort.id}"
    )

    print()

    print("Trainees:")

    for trainee in trainees:
        print(
            f"  {trainee.email} / Trainee123! "
            f"(id={trainee.id}, "
            f"manager_id={manager.id}, "
            f"cohort_id={cohort.id})"
        )

    print()

    print("Tasks:")

    print(
        f"  Task {task1.id}: {task1.title}"
    )

    for subtask in task1_subtasks:
        print(
            f"    - {subtask.title}"
        )

    print()

    print(
        f"  Task {task2.id}: {task2.title}"
    )

    for subtask in task2_subtasks:
        print(
            f"    - {subtask.title}"
        )

    print()

    print("Assignments:")
    print("  Both tasks assigned to both trainees.")

    print()
    print("Sample progress:")
    print("  Trainee 1 -> Task 1 -> 33%")
    print("  Trainee 1 -> Task 1 -> first subtask completed")
    print()


def run() -> None:
    db = SessionLocal()

    try:
        clear_database(db)
        seed_database(db)

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    run()
