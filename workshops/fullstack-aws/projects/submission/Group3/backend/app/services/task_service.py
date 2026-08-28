from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.subtask import Subtask
from app.models.task import Task
from app.repositories.progress_repository import ProgressRepository
from app.repositories.subtask_repository import SubtaskRepository
from app.repositories.task_assignment_repository import TaskAssignmentRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.task_assignment_factory import TaskAssignmentFactory


class TaskService:
    def __init__(self, db: Session):
        self.db = db
        self.tasks = TaskRepository(db)
        self.subtasks = SubtaskRepository(db)
        self.assignments = TaskAssignmentRepository(db)
        self.users = UserRepository(db)
        self.progress = ProgressRepository(db)

    def create_task(self, manager_id: int, payload: TaskCreate) -> Task:
        task = Task(
            title=payload.title,
            description=payload.description,
            created_by=manager_id,
            cohort_id=payload.cohort_id,
            due_date=payload.due_date,
            urgency=payload.urgency,
        )
        self.tasks.create(task)

        for item in payload.subtasks:
            self.subtasks.create(Subtask(task_id=task.id, title=item.title, order_index=item.order_index))

        if payload.cohort_id:
            trainees = self.users.list_by_cohort(payload.cohort_id)
            assignments = TaskAssignmentFactory.build_for_cohort(task.id, trainees)
        else:
            assignments = TaskAssignmentFactory.build_for_trainee_ids(task.id, payload.trainee_ids or [])

        self.assignments.bulk_create(assignments)
        self.db.commit()
        self.db.refresh(task)
        return task

    def get_owned_task(self, manager_id: int, task_id: int) -> Task:
        task = self.tasks.get_by_id(task_id)
        if task is None or task.created_by != manager_id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")
        return task

    def list_manager_tasks(self, manager_id: int) -> list[Task]:
        return self.tasks.list_by_manager(manager_id)

    def update_task(self, manager_id: int, task_id: int, payload: TaskUpdate) -> Task:
        task = self.get_owned_task(manager_id, task_id)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(task, field, value)
        self.db.commit()
        self.db.refresh(task)
        return task

    def delete_task(self, manager_id: int, task_id: int) -> None:
        task = self.get_owned_task(manager_id, task_id)
        self.tasks.delete(task)
        self.db.commit()

    def add_subtask(self, manager_id: int, task_id: int, title: str, order_index: int) -> Subtask:
        self.get_owned_task(manager_id, task_id)
        subtask = self.subtasks.create(Subtask(task_id=task_id, title=title, order_index=order_index))
        self.db.commit()
        self.db.refresh(subtask)
        return subtask

    def get_task_progress_summary(self, manager_id: int, task_id: int) -> dict:
        self.get_owned_task(manager_id, task_id)
        rows = self.assignments.list_by_task(task_id)
        average = sum(row.current_percentage for row in rows) / len(rows) if rows else 0.0
        return {
            "task_id": task_id,
            "average_percentage": round(average, 1),
            "trainees": [
                {
                    "trainee_id": row.trainee_id,
                    "full_name": row.trainee.full_name,
                    "current_percentage": row.current_percentage,
                    "last_updated_at": row.last_updated_at,
                }
                for row in rows
            ],
        }

    def get_trainee_progress_detail(self, manager_id: int, task_id: int, trainee_id: int) -> dict:
        self.get_owned_task(manager_id, task_id)
        assignment = self.assignments.get_by_task_and_trainee(task_id, trainee_id)
        if assignment is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Trainee is not assigned to this task")

        subtasks = self.subtasks.list_by_task(task_id)
        completions = self.progress.list_completions_by_task([s.id for s in subtasks], trainee_id)
        history = self.progress.list_history(assignment.id)

        return {
            "trainee": {"id": assignment.trainee.id, "full_name": assignment.trainee.full_name},
            "current_percentage": assignment.current_percentage,
            "subtasks": [
                {
                    "id": s.id,
                    "title": s.title,
                    "order_index": s.order_index,
                    "is_completed": completions.get(s.id, False),
                }
                for s in subtasks
            ],
            "history": [
                {"percentage": h.percentage, "comment": h.comment, "created_at": h.created_at} for h in history
            ],
        }
