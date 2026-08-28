from datetime import datetime

from pydantic import Field, model_validator

from app.models.enums import UrgencyLevel
from app.schemas.base import CamelModel


class SubtaskCreate(CamelModel):
    title: str
    order_index: int = 0


class SubtaskUpdate(CamelModel):
    title: str | None = None
    order_index: int | None = None


class SubtaskOut(CamelModel):
    id: int
    title: str
    order_index: int
    is_completed: bool = False


class TaskCreate(CamelModel):
    title: str
    description: str | None = None
    due_date: datetime | None = None
    urgency: UrgencyLevel = UrgencyLevel.medium
    cohort_id: int | None = None
    trainee_ids: list[int] | None = None
    subtasks: list[SubtaskCreate] = Field(default_factory=list)

    @model_validator(mode="after")
    def check_exactly_one_target(self) -> "TaskCreate":
        if bool(self.cohort_id) == bool(self.trainee_ids):
            raise ValueError("provide exactly one of cohortId or traineeIds")
        return self


class TaskUpdate(CamelModel):
    title: str | None = None
    description: str | None = None
    due_date: datetime | None = None
    urgency: UrgencyLevel | None = None


class TaskOut(CamelModel):
    id: int
    title: str
    description: str | None
    due_date: datetime | None
    urgency: UrgencyLevel
    assigned_trainee_count: int


class TaskDetailOut(CamelModel):
    id: int
    title: str
    description: str | None
    due_date: datetime | None
    urgency: UrgencyLevel
    subtasks: list[SubtaskOut]


class TraineeProgressSummary(CamelModel):
    trainee_id: int
    full_name: str
    current_percentage: int
    last_updated_at: datetime | None


class TaskProgressOut(CamelModel):
    task_id: int
    average_percentage: float
    trainees: list[TraineeProgressSummary]


class ProgressHistoryEntry(CamelModel):
    percentage: int
    comment: str | None
    created_at: datetime


class TraineeRef(CamelModel):
    id: int
    full_name: str


class TraineeProgressDetailOut(CamelModel):
    trainee: TraineeRef
    current_percentage: int
    subtasks: list[SubtaskOut]
    history: list[ProgressHistoryEntry]
