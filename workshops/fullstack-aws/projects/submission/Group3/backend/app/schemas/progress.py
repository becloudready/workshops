from datetime import datetime

from pydantic import Field

from app.models.enums import UrgencyLevel
from app.schemas.base import CamelModel
from app.schemas.task import SubtaskOut


class SubtaskToggle(CamelModel):
    is_completed: bool


class SubtaskToggleOut(CamelModel):
    id: int
    is_completed: bool


class ProgressUpdateCreate(CamelModel):
    percentage: int = Field(ge=0, le=100)
    comment: str | None = None


class ProgressUpdateOut(CamelModel):
    task_id: int
    percentage: int
    comment: str | None
    created_at: datetime


class StudentTaskListItem(CamelModel):
    task_id: int
    title: str
    due_date: datetime | None
    urgency: UrgencyLevel
    current_percentage: int
    subtask_summary: str


class StudentTaskDetail(CamelModel):
    id: int
    title: str
    description: str | None
    due_date: datetime | None
    urgency: UrgencyLevel
    subtasks: list[SubtaskOut]
    current_percentage: int
