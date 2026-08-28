"""Seed realistic development data for local testing.

Run from the backend directory:

    python -m scripts.seed_dev_data

The script is idempotent: running it again reuses existing seed records.
"""

from datetime import datetime, timedelta, timezone

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.cohort import Cohort
from app.models.enums import UrgencyLevel, UserRole
from app.models.progress_update import ProgressUpdate
from app.models.subtask import Subtask
from app.models.subtask_completion import SubtaskCompletion
from app.models.task import Task
from app.models.task_assignment import TaskAssignment
from app.models.user import User

MANAGER_EMAIL = "manager@noticeboardtracker.dev"
MANAGER_PASSWORD = "Manager123!"
TRAINEE_PASSWORD = "Trainee123!"


def run() -> None:
    db = SessionLocal()

    try:
        manager = db.query(User).filter(User.email == MANAGER_EMAIL).first()

        if manager is None:
            manager = User(
                email=MANAGER_EMAIL,
                hashed_password=hash_password(MANAGER_PASSWORD),
                full_name="Morgan Manager",
                role=UserRole.manager,
            )
            db.add(manager)
            db.flush()

        cohort = db.query(Cohort).filter(
            Cohort.name == "Cohort Alpha"
        ).first()

        if cohort is None:
            cohort = Cohort(
                name="Cohort Alpha",
                description="Development cohort",
                manager_id=manager.id,
            )
            db.add(cohort)
            db.flush()

        trainees = []
        trainee_names = [
            "Alex Johnson",
            "Jamie Chen",
            "Taylor Smith",
            "Jordan Williams",
        ]

        for index, full_name in enumerate(trainee_names, start=1):
            email = f"trainee{index}@noticeboardtracker.dev"

            trainee = db.query(User).filter(
                User.email == email
            ).first()

            if trainee is None:
                trainee = User(
                    email=email,
                    hashed_password=hash_password(TRAINEE_PASSWORD),
                    full_name=full_name,
                    role=UserRole.trainee,
                    cohort_id=cohort.id,
                )
                db.add(trainee)
                db.flush()

            trainees.append(trainee)

        task_specs = [
            {
                "title": "Complete New Hire Orientation",
                "description": "Finish the required onboarding activities.",
                "urgency": UrgencyLevel.high,
                "due_in_days": 7,
                "subtasks": [
                    "Read the employee handbook",
                    "Configure workstation",
                    "Attend orientation",
                ],
                "progress": [100, 67, 33, 0],
            },
            {
                "title": "Build REST API Feature",
                "description": "Design, implement, and verify a backend feature.",
                "urgency": UrgencyLevel.urgent,
                "due_in_days": 14,
                "subtasks": [
                    "Define request schema",
                    "Implement endpoint",
                    "Add automated tests",
                ],
                "progress": [67, 33, 0, 0],
            },
            {
                "title": "Review AWS Deployment",
                "description": "Learn and document the deployment flow.",
                "urgency": UrgencyLevel.medium,
                "due_in_days": 21,
                "subtasks": [
                    "Review Terraform",
                    "Inspect Lambda configuration",
                    "Document deployment steps",
                ],
                "progress": [33, 0, 0, 0],
            },
        ]

        now = datetime.now(timezone.utc)

        for task_spec in task_specs:
            task = (
                db.query(Task)
                .filter(
                    Task.created_by == manager.id,
                    Task.title == task_spec["title"],
                )
                .first()
            )

            if task is None:
                task = Task(
                    title=task_spec["title"],
                    description=task_spec["description"],
                    created_by=manager.id,
                    cohort_id=cohort.id,
                    due_date=now + timedelta(
                        days=task_spec["due_in_days"]
                    ),
                    urgency=task_spec["urgency"],
                )
                db.add(task)
                db.flush()

            subtasks = []

            for order_index, title in enumerate(task_spec["subtasks"]):
                subtask = (
                    db.query(Subtask)
                    .filter(
                        Subtask.task_id == task.id,
                        Subtask.title == title,
                    )
                    .first()
                )

                if subtask is None:
                    subtask = Subtask(
                        task_id=task.id,
                        title=title,
                        order_index=order_index,
                    )
                    db.add(subtask)
                    db.flush()

                subtasks.append(subtask)

            for trainee, percentage in zip(
                trainees,
                task_spec["progress"],
            ):
                assignment = (
                    db.query(TaskAssignment)
                    .filter(
                        TaskAssignment.task_id == task.id,
                        TaskAssignment.trainee_id == trainee.id,
                    )
                    .first()
                )

                if assignment is None:
                    assignment = TaskAssignment(
                        task_id=task.id,
                        trainee_id=trainee.id,
                        current_percentage=percentage,
                        last_updated_at=now if percentage else None,
                    )
                    db.add(assignment)
                    db.flush()

                if percentage and not assignment.history:
                    db.add(
                        ProgressUpdate(
                            task_assignment_id=assignment.id,
                            percentage=percentage,
                            comment="Seeded progress update",
                        )
                    )

                completed_count = round(
                    len(subtasks) * percentage / 100
                )

                for subtask in subtasks[:completed_count]:
                    completion = (
                        db.query(SubtaskCompletion)
                        .filter(
                            SubtaskCompletion.subtask_id == subtask.id,
                            SubtaskCompletion.trainee_id == trainee.id,
                        )
                        .first()
                    )

                    if completion is None:
                        db.add(
                            SubtaskCompletion(
                                subtask_id=subtask.id,
                                trainee_id=trainee.id,
                                is_completed=True,
                                completed_at=now,
                            )
                        )

        db.commit()

        print("Seed complete:")
        print(
            f"  manager -> {MANAGER_EMAIL} / "
            f"{MANAGER_PASSWORD}"
        )

        for index in range(1, len(trainees) + 1):
            print(
                f"  trainee {index} -> "
                f"trainee{index}@noticeboardtracker.dev / "
                f"{TRAINEE_PASSWORD}"
            )

        print(f"  cohort -> {cohort.name} (id={cohort.id})")
        print(f"  tasks -> {len(task_specs)}")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()