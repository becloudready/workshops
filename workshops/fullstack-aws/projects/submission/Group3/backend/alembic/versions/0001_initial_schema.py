"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-08-28

"""
from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None

user_role = sa.Enum("trainee", "manager", "hr", name="user_role")
urgency_level = sa.Enum("low", "medium", "high", "urgent", name="urgency_level")


def upgrade() -> None:
    op.create_table(
        "cohorts",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("manager_id", sa.Integer, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("role", user_role, nullable=False),
        sa.Column("cohort_id", sa.Integer, sa.ForeignKey("cohorts.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_foreign_key("fk_cohorts_manager_id", "cohorts", "users", ["manager_id"], ["id"])

    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("created_by", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("cohort_id", sa.Integer, sa.ForeignKey("cohorts.id"), nullable=True),
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("urgency", urgency_level, nullable=False, server_default="medium"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "subtasks",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("task_id", sa.Integer, sa.ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("order_index", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "task_assignments",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("task_id", sa.Integer, sa.ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("trainee_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("current_percentage", sa.SmallInteger, nullable=False, server_default="0"),
        sa.Column("last_updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("task_id", "trainee_id", name="uq_task_assignment"),
        sa.CheckConstraint("current_percentage BETWEEN 0 AND 100", name="ck_task_assignment_pct"),
    )

    op.create_table(
        "subtask_completions",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("subtask_id", sa.Integer, sa.ForeignKey("subtasks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("trainee_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("is_completed", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("subtask_id", "trainee_id", name="uq_subtask_completion"),
    )

    op.create_table(
        "progress_updates",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "task_assignment_id",
            sa.Integer,
            sa.ForeignKey("task_assignments.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("percentage", sa.SmallInteger, nullable=False),
        sa.Column("comment", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint("percentage BETWEEN 0 AND 100", name="ck_progress_update_pct"),
    )

    op.create_index("idx_task_assignments_task", "task_assignments", ["task_id"])
    op.create_index("idx_task_assignments_trainee", "task_assignments", ["trainee_id"])
    op.create_index("idx_progress_updates_assignment", "progress_updates", ["task_assignment_id", "created_at"])


def downgrade() -> None:
    op.drop_table("progress_updates")
    op.drop_table("subtask_completions")
    op.drop_table("task_assignments")
    op.drop_table("subtasks")
    op.drop_table("tasks")
    op.drop_constraint("fk_cohorts_manager_id", "cohorts", type_="foreignkey")
    op.drop_table("users")
    op.drop_table("cohorts")
    urgency_level.drop(op.get_bind(), checkfirst=True)
    user_role.drop(op.get_bind(), checkfirst=True)
