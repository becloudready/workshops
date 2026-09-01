from datetime import datetime

from pydantic import Field

from app.models.enums import UrgencyLevel
from app.schemas.base import CamelModel


# ============================================================
# COHORT
# ============================================================

class TraineeCohortOut(CamelModel):
    id: int
    name: str


# ============================================================
# TASK
# ============================================================

class TraineeTaskOut(CamelModel):
    id: int
    title: str
    description: str | None
    due_date: datetime | None
    urgency: UrgencyLevel
    current_percentage: int


# ============================================================
# TRAINEE DETAIL
# ============================================================

class TraineeOut(CamelModel):
    id: int
    full_name: str
    email: str
    cohort: TraineeCohortOut | None
    tasks: list[TraineeTaskOut]


# ============================================================
# TRAINEE LIST ITEM
# ============================================================

class TraineeListItem(CamelModel):
    id: int
    full_name: str
    email: str
    cohort: TraineeCohortOut | None


# ============================================================
# CREATE TRAINEE
# ============================================================

class TraineeCreate(CamelModel):
    full_name: str = Field(min_length=1)
    email: str
    password: str = Field(min_length=8)
    cohort_id: int | None = None


# ============================================================
# UPDATE TRAINEE
# ============================================================

class TraineeUpdate(CamelModel):
    full_name: str | None = Field(default=None, min_length=1)
    email: str | None = None
    cohort_id: int | None = None