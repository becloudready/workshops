from datetime import datetime

from pydantic import Field, model_validator

from app.models.enums import UrgencyLevel
from app.schemas.base import CamelModel


# ============================================================
# SUBTASKS
# ============================================================


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


# ============================================================
# TASK CREATE / UPDATE
# ============================================================


class TaskCreate(CamelModel):
    title: str
    description: str | None = None
    due_date: datetime | None = None
    urgency: UrgencyLevel = UrgencyLevel.medium

    # A task can be assigned either to:
    #   1. an entire cohort
    #   2. individual trainees
    #
    # Exactly one target must be provided.

    cohort_id: int | None = None
    trainee_ids: list[int] | None = None

    subtasks: list[SubtaskCreate] = Field(default_factory=list)

    @model_validator(mode="after")
    def check_exactly_one_target(self) -> "TaskCreate":
        has_cohort = self.cohort_id is not None
        has_trainees = bool(self.trainee_ids)

        if has_cohort == has_trainees:
            raise ValueError(
                "provide exactly one of cohortId or traineeIds"
            )

        return self


class TaskUpdate(CamelModel):
    title: str | None = None
    description: str | None = None
    due_date: datetime | None = None
    urgency: UrgencyLevel | None = None


# ============================================================
# COHORT REFERENCE
# ============================================================


class CohortRef(CamelModel):
    id: int
    name: str


# ============================================================
# TRAINEE REFERENCE
# ============================================================


class TraineeRef(CamelModel):
    id: int
    full_name: str


# ============================================================
# TASK OUTPUT
# ============================================================


class TaskOut(CamelModel):
    id: int
    title: str
    description: str | None
    due_date: datetime | None
    urgency: UrgencyLevel

    # Cohort information.
    #
    # Example JSON:
    #
    # {
    #   "cohortId": 1,
    #   "cohort": {
    #     "id": 1,
    #     "name": "Cohort A"
    #   }
    # }

    cohort_id: int | None = None
    cohort: CohortRef | None = None

    assigned_trainee_count: int


class TaskDetailOut(CamelModel):
    id: int
    title: str
    description: str | None
    due_date: datetime | None
    urgency: UrgencyLevel

    cohort_id: int | None = None
    cohort: CohortRef | None = None

    subtasks: list[SubtaskOut]


# ============================================================
# TASK PROGRESS
# ============================================================


class TraineeProgressSummary(CamelModel):
    """
    Summary shown when viewing task progress.

    current_percentage should be calculated by the backend
    from the trainee's completed subtasks.

    For the completed-subtask calculation:

        completed_subtasks / total_subtasks * 100

    Example:

        3 completed / 4 total = 75%
    """

    trainee_id: int
    full_name: str
    current_percentage: int
    last_updated_at: datetime | None = None


class TaskProgressOut(CamelModel):
    """
    Overall progress for a task.

    average_percentage is the average of the individual
    trainee percentages for this task.
    """

    task_id: int
    average_percentage: float
    trainees: list[TraineeProgressSummary]


# ============================================================
# PROGRESS HISTORY
# ============================================================


class ProgressHistoryEntry(CamelModel):
    """
    A historical progress update made for a trainee.

    The frontend can display the percentage, comment,
    and timestamp when the trainee's progress is expanded.
    """

    percentage: int
    comment: str | None = None
    created_at: datetime


# ============================================================
# TRAINEE PROGRESS DETAIL
# ============================================================


class TraineeProgressDetailOut(CamelModel):
    """
    Detailed progress for one trainee on one task.

    Used by:

        GET /manager/tasks/{task_id}/progress/{trainee_id}

    This allows the frontend to display:

        Trainee
          Current Progress
          Subtask 1
          Subtask 2
          Subtask 3
          Progress History
            50% - comment
            75% - comment
            100% - comment
    """

    trainee: TraineeRef

    # Calculated from completed subtasks.
    current_percentage: int

    # All subtasks for the task, including their completion state.
    subtasks: list[SubtaskOut]

    # Historical progress updates/comments.
    history: list[ProgressHistoryEntry]
