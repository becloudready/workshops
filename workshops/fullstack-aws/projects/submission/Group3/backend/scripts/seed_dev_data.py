"""Seeds a manager, a cohort, and two trainees for local testing.

There's no signup endpoint yet (accounts are manager/admin-created), so this
script is the stand-in until that exists. Run with the venv active and .env
configured, from the backend/ directory:

    python -m scripts.seed_dev_data
"""
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.cohort import Cohort
from app.models.enums import UserRole
from app.models.user import User


def run() -> None:
    db = SessionLocal()
    try:
        manager = User(
            email="manager@noticeboard.test",
            hashed_password=hash_password("Manager123!"),
            full_name="Morgan Manager",
            role=UserRole.manager,
        )
        db.add(manager)
        db.flush()

        cohort = Cohort(name="Cohort Alpha", description="Test cohort", manager_id=manager.id)
        db.add(cohort)
        db.flush()

        trainees = [
            User(
                email=f"trainee{i}@noticeboard.test",
                hashed_password=hash_password("Trainee123!"),
                full_name=f"Trainee {i}",
                role=UserRole.trainee,
                cohort_id=cohort.id,
            )
            for i in range(1, 3)
        ]
        db.add_all(trainees)
        db.commit()

        print("Seeded:")
        print("  manager   -> manager@noticeboard.test / Manager123!")
        print(f"  trainee 1 -> trainee1@noticeboard.test / Trainee123!  (cohort_id={cohort.id})")
        print(f"  trainee 2 -> trainee2@noticeboard.test / Trainee123!  (cohort_id={cohort.id})")
    finally:
        db.close()


if __name__ == "__main__":
    run()
