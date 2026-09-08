from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.progress_update import ProgressUpdate
from app.models.subtask_completion import SubtaskCompletion


class ProgressRepository:
    def __init__(self, db: Session):
        self.db = db

    def add_history_entry(self, task_assignment_id: int, percentage: int, comment: str | None) -> ProgressUpdate:
        entry = ProgressUpdate(task_assignment_id=task_assignment_id, percentage=percentage, comment=comment)
        self.db.add(entry)
        self.db.flush()
        return entry

    def list_history(self, task_assignment_id: int) -> list[ProgressUpdate]:
        return (
            self.db.query(ProgressUpdate)
            .filter(ProgressUpdate.task_assignment_id == task_assignment_id)
            .order_by(ProgressUpdate.created_at.desc())
            .all()
        )

    def get_completion(self, subtask_id: int, trainee_id: int) -> SubtaskCompletion | None:
        return (
            self.db.query(SubtaskCompletion)
            .filter(SubtaskCompletion.subtask_id == subtask_id, SubtaskCompletion.trainee_id == trainee_id)
            .first()
        )

    def set_completion(self, subtask_id: int, trainee_id: int, is_completed: bool) -> SubtaskCompletion:
        completion = self.get_completion(subtask_id, trainee_id)
        if completion is None:
            completion = SubtaskCompletion(subtask_id=subtask_id, trainee_id=trainee_id)
            self.db.add(completion)
        completion.is_completed = is_completed
        completion.completed_at = datetime.now(timezone.utc) if is_completed else None
        self.db.flush()
        return completion

    def list_completions_by_task(self, subtask_ids: list[int], trainee_id: int) -> dict[int, bool]:
        if not subtask_ids:
            return {}
        rows = (
            self.db.query(SubtaskCompletion)
            .filter(SubtaskCompletion.subtask_id.in_(subtask_ids), SubtaskCompletion.trainee_id == trainee_id)
            .all()
        )
        return {row.subtask_id: row.is_completed for row in rows}
