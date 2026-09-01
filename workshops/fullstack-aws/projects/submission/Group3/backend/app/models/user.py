from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import UserRole


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"),
        nullable=False,
    )

    # ========================================================
    # MANAGER
    # ========================================================

    manager_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    manager = relationship(
        "User",
        remote_side=[id],
        foreign_keys=[manager_id],
        back_populates="managed_trainees",
    )

    managed_trainees = relationship(
        "User",
        foreign_keys=[manager_id],
        back_populates="manager",
    )

    # ========================================================
    # COHORT
    # ========================================================

    cohort_id: Mapped[int | None] = mapped_column(
        ForeignKey("cohorts.id"),
        nullable=True,
    )

    cohort = relationship(
        "Cohort",
        foreign_keys=[cohort_id],
        back_populates="trainees",
    )

    # ========================================================
    # TIMESTAMPS
    # ========================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # ========================================================
    # TASK ASSIGNMENTS
    # ========================================================

    task_assignments = relationship(
        "TaskAssignment",
        back_populates="trainee",
        cascade="all, delete-orphan",
    )
