from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Cohort(Base):
    __tablename__ = "cohorts"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # ========================================================
    # MANAGER
    # ========================================================

    manager_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    # ========================================================
    # TIMESTAMPS
    # ========================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # ========================================================
    # TRAINEES
    # ========================================================

    # Deleting a cohort does NOT delete its trainees.
    # Their users.cohort_id is set to NULL.
    trainees = relationship(
        "User",
        foreign_keys="User.cohort_id",
        back_populates="cohort",
    )

    # ========================================================
    # TASKS
    # ========================================================

    # Deleting a cohort does NOT delete its tasks.
    # Their tasks.cohort_id should be set to NULL.
    tasks = relationship(
        "Task",
        foreign_keys="Task.cohort_id",
        back_populates="cohort",
    )
