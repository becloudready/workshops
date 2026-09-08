from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, SmallInteger, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class TaskAssignment(Base):
    """Per-trainee anchor for a task - a cohort task fans out into one row per trainee here."""

    __tablename__ = "task_assignments"

    __table_args__ = (
        UniqueConstraint(
            "task_id",
            "trainee_id",
            name="uq_task_assignment",
        ),
        CheckConstraint(
            "current_percentage BETWEEN 0 AND 100",
            name="ck_task_assignment_pct",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    task_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False,
    )

    trainee_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    current_percentage: Mapped[int] = mapped_column(
        SmallInteger,
        default=0,
        nullable=False,
    )

    last_updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # ========================================================
    # TASK
    # ========================================================

    task = relationship(
        "Task",
        back_populates="assignments",
    )

    # ========================================================
    # TRAINEE
    # ========================================================

    trainee = relationship(
        "User",
        back_populates="task_assignments",
    )

    # ========================================================
    # PROGRESS HISTORY
    # ========================================================

    history = relationship(
        "ProgressUpdate",
        back_populates="assignment",
        cascade="all, delete-orphan",
    )
