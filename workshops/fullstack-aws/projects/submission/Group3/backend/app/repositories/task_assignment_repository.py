from sqlalchemy.orm import Session

from app.models.task_assignment import TaskAssignment


class TaskAssignmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def bulk_create(self, assignments: list[TaskAssignment]) -> list[TaskAssignment]:
        self.db.add_all(assignments)
        self.db.flush()
        return assignments

    def list_by_task(self, task_id: int) -> list[TaskAssignment]:
        return self.db.query(TaskAssignment).filter(TaskAssignment.task_id == task_id).all()

    def get_by_task_and_trainee(self, task_id: int, trainee_id: int) -> TaskAssignment | None:
        return (
            self.db.query(TaskAssignment)
            .filter(TaskAssignment.task_id == task_id, TaskAssignment.trainee_id == trainee_id)
            .first()
        )

    def list_by_trainee(self, trainee_id: int) -> list[TaskAssignment]:
        return self.db.query(TaskAssignment).filter(TaskAssignment.trainee_id == trainee_id).all()
