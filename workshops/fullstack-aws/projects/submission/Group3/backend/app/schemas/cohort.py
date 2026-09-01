from datetime import datetime

from app.schemas.base import CamelModel

# ============================================================
# CREATE COHORT
# ============================================================

class CohortCreate(CamelModel):
    name: str
    description: str | None = None


# ============================================================
# COHORT TRAINEE
# ============================================================

class CohortTraineeOut(CamelModel):
    id: int
    full_name: str
    email: str
    current_percentage: int = 0


# ============================================================
# COHORT TASK
# ============================================================

class CohortTaskOut(CamelModel):
    id: int
    title: str
    description: str | None
    due_date: datetime | None
    urgency: str

    # Average progress for this task across assigned trainees.
    average_percentage: float = 0.0


# ============================================================
# COHORT LIST
# ============================================================

class CohortOut(CamelModel):
    id: int
    name: str
    description: str | None
    trainee_count: int


# ============================================================
# PROGRESS HISTORY
# ============================================================

class ProgressHistoryEntry(CamelModel):
    percentage: int
    comment: str | None = None
    created_at: datetime


# ============================================================
# SUBTASK PROGRESS
# ============================================================

class CohortSubtaskOut(CamelModel):
    id: int
    title: str
    order_index: int

    # True when the trainee has completed this subtask.
    is_completed: bool = False

    # Derived percentage:
    #   incomplete = 0
    #   complete = 100
    percentage: int = 0


# ============================================================
# TRAINEE TASK PROGRESS
# ============================================================

class CohortTraineeTaskOut(CamelModel):
    id: int
    title: str
    description: str | None = None

    # Overall progress for this task for this trainee.
    current_percentage: int = 0

    subtasks: list[CohortSubtaskOut] = []

    history: list[ProgressHistoryEntry] = []


# ============================================================
# COHORT TRAINEE DETAIL
# ============================================================

class CohortTraineeDetailOut(CamelModel):
    id: int
    full_name: str
    email: str

    # Overall progress for the trainee's cohort tasks.
    current_percentage: int = 0

    # Tasks assigned to this trainee through the cohort.
    tasks: list[CohortTraineeTaskOut] = []


# ============================================================
# COHORT DETAIL
# ============================================================

class CohortDetailOut(CamelModel):
    id: int
    name: str
    description: str | None

    trainees: list[CohortTraineeDetailOut] = []

    tasks: list[CohortTaskOut] = []
