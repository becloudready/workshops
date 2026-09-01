from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.task_assignment import TaskAssignment
from app.repositories.progress_repository import ProgressRepository
from app.repositories.subtask_repository import SubtaskRepository
from app.repositories.task_assignment_repository import TaskAssignmentRepository

_URGENCY_RANK = {"urgent": 0, "high": 1, "medium": 2, "low": 3}


class ProgressService:
    def __init__(self, db: Session):
        self.db = db
        self.subtasks = SubtaskRepository(db)
        self.assignments = TaskAssignmentRepository(db)
        self.progress = ProgressRepository(db)

    def _get_own_assignment(self, trainee_id: int, task_id: int) -> TaskAssignment:
        assignment = self.assignments.get_by_task_and_trainee(task_id, trainee_id)
        if assignment is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not assigned to this trainee")
        return assignment

    def list_student_tasks(self, trainee_id: int, sort: str | None = None) -> list[dict]:
        assignments = self.assignments.list_by_trainee(trainee_id)
        items = []
        for a in assignments:
            task = a.task
            subtasks = self.subtasks.list_by_task(task.id)
            completions = self.progress.list_completions_by_task([s.id for s in subtasks], trainee_id)
            done = sum(1 for s in subtasks if completions.get(s.id, False))
            items.append(
                {
                    "task_id": task.id,
                    "title": task.title,
                    "due_date": task.due_date,
                    "urgency": task.urgency,
                    "current_percentage": a.current_percentage,
                    "subtask_summary": f"{done}/{len(subtasks)} completed",
                }
            )
        if sort == "urgency":
            items.sort(key=lambda item: _URGENCY_RANK.get(item["urgency"].value, 4))
        return items

    def get_student_task_detail(self, trainee_id: int, task_id: int) -> dict:
        assignment = self._get_own_assignment(trainee_id, task_id)
        task = assignment.task
        subtasks = self.subtasks.list_by_task(task_id)
        completions = self.progress.list_completions_by_task([s.id for s in subtasks], trainee_id)
        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date,
            "urgency": task.urgency,
            "subtasks": [
                {
                    "id": s.id,
                    "title": s.title,
                    "order_index": s.order_index,
                    "is_completed": completions.get(s.id, False),
                }
                for s in subtasks
            ],
            "current_percentage": assignment.current_percentage,
        }

    def toggle_subtask(self, trainee_id: int, subtask_id: int, is_completed: bool) -> dict:
        subtask = self.subtasks.get_by_id(subtask_id)
        if subtask is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Subtask not found")
        self._get_own_assignment(trainee_id, subtask.task_id)
        completion = self.progress.set_completion(subtask_id, trainee_id, is_completed)
        self.db.commit()
        return {"id": subtask_id, "is_completed": completion.is_completed}

    def submit_progress_update(self, trainee_id: int, task_id: int, percentage: int, comment: str | None) -> dict:
        assignment = self._get_own_assignment(trainee_id, task_id)
        entry = self.progress.add_history_entry(assignment.id, percentage, comment)
        assignment.current_percentage = percentage
        assignment.last_updated_at = datetime.now(timezone.utc)
        self.db.commit()
        return {
            "task_id": task_id,
            "percentage": entry.percentage,
            "comment": entry.comment,
            "created_at": entry.created_at,
        }

    def get_progress_history(self, trainee_id: int, task_id: int) -> list[dict]:
        assignment = self._get_own_assignment(trainee_id, task_id)
        history = self.progress.list_history(assignment.id)
        return [{"percentage": h.percentage, "comment": h.comment, "created_at": h.created_at} for h in history]
