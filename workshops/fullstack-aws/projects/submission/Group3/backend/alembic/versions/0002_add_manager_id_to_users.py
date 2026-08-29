"""add manager_id to users

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-29

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add manager_id to users.
    #
    # This is nullable because manager users do not belong
    # to another manager. Trainee users will have their
    # manager's user.id stored here.
    op.add_column(
        "users",
        sa.Column(
            "manager_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    # Self-referencing foreign key:
    #
    # users.manager_id -> users.id
    op.create_foreign_key(
        "fk_users_manager_id",
        "users",
        "users",
        ["manager_id"],
        ["id"],
    )


def downgrade() -> None:
    # Remove the self-referencing foreign key first.
    op.drop_constraint(
        "fk_users_manager_id",
        "users",
        type_="foreignkey",
    )

    # Then remove the column.
    op.drop_column(
        "users",
        "manager_id",
    )
