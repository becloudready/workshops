from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.task_assignment import TaskAssignment
from app.repositories.progress_repository import ProgressRepository
from app.repositories.subtask_repository import SubtaskRepository
from app.repositories.task_assignment_repository import TaskAssignmentRepository


_URGENCY_RANK = {
    "urgent": 0,
    "high": 1,
    "medium": 2,
    "low": 3,
}


class ProgressService:

    def __init__(self, db: Session):
        self.db = db
        self.subtasks = SubtaskRepository(db)
        self.assignments = TaskAssignmentRepository(db)
        self.progress = ProgressRepository(db)

    # ========================================================
    # HELPERS
    # ========================================================

    def _get_own_assignment(
        self,
        trainee_id: int,
        task_id: int,
    ) -> TaskAssignment:

        assignment = self.assignments.get_by_task_and_trainee(
            task_id,
            trainee_id,
        )

        if assignment is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                "Task not assigned to this trainee",
            )

        return assignment

    # ========================================================
    # STUDENT TASK LIST
    # ========================================================

    def list_student_tasks(
        self,
        trainee_id: int,
        sort: str | None = None,
    ) -> list[dict]:

        assignments = self.assignments.list_by_trainee(trainee_id)

        items = []

        for assignment in assignments:

            task = assignment.task

            subtasks = self.subtasks.list_by_task(task.id)

            completions = self.progress.list_completions_by_task(
                [subtask.id for subtask in subtasks],
                trainee_id,
            )

            completed_count = sum(
                1
                for subtask in subtasks
                if completions.get(subtask.id, False)
            )

            items.append(
                {
                    "task_id": task.id,
                    "title": task.title,
                    "due_date": task.due_date,
                    "urgency": task.urgency,
                    "current_percentage": assignment.current_percentage,
                    "subtask_summary": (
                        f"{completed_count}/{len(subtasks)} completed"
                    ),
                }
            )

        if sort == "urgency":
            items.sort(
                key=lambda item: _URGENCY_RANK.get(
                    item["urgency"].value,
                    4,
                )
            )

        return items

    # ========================================================
    # STUDENT TASK DETAIL
    # ========================================================

    def get_student_task_detail(
        self,
        trainee_id: int,
        task_id: int,
    ) -> dict:

        assignment = self._get_own_assignment(
            trainee_id,
            task_id,
        )

        task = assignment.task

        subtasks = self.subtasks.list_by_task(task_id)

        completions = self.progress.list_completions_by_task(
            [subtask.id for subtask in subtasks],
            trainee_id,
        )

        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date,
            "urgency": task.urgency,

            "subtasks": [
                {
                    "id": subtask.id,
                    "title": subtask.title,
                    "order_index": subtask.order_index,
                    "is_completed": completions.get(
                        subtask.id,
                        False,
                    ),
                }
                for subtask in subtasks
            ],

            "current_percentage": assignment.current_percentage,
        }

    # ========================================================
    # TOGGLE SUBTASK
    # ========================================================

    def toggle_subtask(
        self,
        trainee_id: int,
        subtask_id: int,
        is_completed: bool,
    ) -> dict:

        # ----------------------------------------------------
        # Find subtask
        # ----------------------------------------------------

        subtask = self.subtasks.get_by_id(subtask_id)

        if subtask is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                "Subtask not found",
            )

        # ----------------------------------------------------
        # Make sure trainee owns the task
        # ----------------------------------------------------

        assignment = self._get_own_assignment(
            trainee_id,
            subtask.task_id,
        )

        # ----------------------------------------------------
        # Update completion
        # ----------------------------------------------------

        completion = self.progress.set_completion(
            subtask_id,
            trainee_id,
            is_completed,
        )

        # ----------------------------------------------------
        # Get all subtasks for this task
        # ----------------------------------------------------

        subtasks = self.subtasks.list_by_task(
            subtask.task_id
        )

        # ----------------------------------------------------
        # Get completion status
        # ----------------------------------------------------

        completions = self.progress.list_completions_by_task(
            [s.id for s in subtasks],
            trainee_id,
        )

        # ----------------------------------------------------
        # Calculate progress
        # ----------------------------------------------------

        completed_count = sum(
            1
            for s in subtasks
            if completions.get(s.id, False)
        )

        total_count = len(subtasks)

        if total_count > 0:
            percentage = round(
                (completed_count / total_count) * 100
            )
        else:
            percentage = 0

        # ----------------------------------------------------
        # Update task assignment
        # ----------------------------------------------------

        assignment.current_percentage = percentage

        assignment.last_updated_at = datetime.now(
            timezone.utc
        )

        self.db.commit()

        # ----------------------------------------------------
        # Return result
        # ----------------------------------------------------

        return {
            "id": subtask_id,
            "is_completed": completion.is_completed,
            "percentage": percentage,
        }

    # ========================================================
    # MANUAL PROGRESS UPDATE
    # ========================================================

    def submit_progress_update(
        self,
        trainee_id: int,
        task_id: int,
        percentage: int,
        comment: str | None,
    ) -> dict:

        assignment = self._get_own_assignment(
            trainee_id,
            task_id,
        )

        entry = self.progress.add_history_entry(
            assignment.id,
            percentage,
            comment,
        )

        assignment.current_percentage = percentage

        assignment.last_updated_at = datetime.now(
            timezone.utc
        )

        self.db.commit()

        return {
            "task_id": task_id,
            "percentage": entry.percentage,
            "comment": entry.comment,
            "created_at": entry.created_at,
        }

    # ========================================================
    # PROGRESS HISTORY
    # ========================================================

    def get_progress_history(
        self,
        trainee_id: int,
        task_id: int,
    ) -> list[dict]:

        assignment = self._get_own_assignment(
            trainee_id,
            task_id,
        )

        history = self.progress.list_history(
            assignment.id
        )

        return [
            {
                "percentage": entry.percentage,
                "comment": entry.comment,
                "created_at": entry.created_at,
            }
            for entry in history
        ]
