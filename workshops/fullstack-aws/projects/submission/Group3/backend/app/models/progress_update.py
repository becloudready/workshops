from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, SmallInteger, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ProgressUpdate(Base):
    """Append-only history log - a new row per trainee update, never an overwrite."""

    __tablename__ = "progress_updates"
    __table_args__ = (CheckConstraint("percentage BETWEEN 0 AND 100", name="ck_progress_update_pct"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    task_assignment_id: Mapped[int] = mapped_column(
        ForeignKey("task_assignments.id", ondelete="CASCADE"), nullable=False
    )
    percentage: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    assignment = relationship("TaskAssignment", back_populates="history")
