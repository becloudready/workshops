from sqlalchemy.orm import Session

from app.models.task import Task


class TaskRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, task: Task) -> Task:
        self.db.add(task)
        self.db.flush()
        return task

    def get_by_id(self, task_id: int) -> Task | None:
        return self.db.get(Task, task_id)

    def list_by_manager(self, manager_id: int) -> list[Task]:
        return (
            self.db.query(Task)
            .filter(Task.created_by == manager_id)
            .order_by(Task.created_at.desc())
            .all()
        )

    def delete(self, task: Task) -> None:
        self.db.delete(task)
