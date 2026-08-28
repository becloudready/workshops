from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class SubtaskCompletion(Base):
    __tablename__ = "subtask_completions"
    __table_args__ = (UniqueConstraint("subtask_id", "trainee_id", name="uq_subtask_completion"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    subtask_id: Mapped[int] = mapped_column(ForeignKey("subtasks.id", ondelete="CASCADE"), nullable=False)
    trainee_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    subtask = relationship("Subtask")
    trainee = relationship("User")
