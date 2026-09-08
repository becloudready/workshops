from sqlalchemy.orm import Session

from app.models.subtask import Subtask


class SubtaskRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, subtask: Subtask) -> Subtask:
        self.db.add(subtask)
        self.db.flush()
        return subtask

    def get_by_id(self, subtask_id: int) -> Subtask | None:
        return self.db.get(Subtask, subtask_id)

    def list_by_task(self, task_id: int) -> list[Subtask]:
        return (
            self.db.query(Subtask)
            .filter(Subtask.task_id == task_id)
            .order_by(Subtask.order_index)
            .all()
        )

    def delete(self, subtask: Subtask) -> None:
        self.db.delete(subtask)
