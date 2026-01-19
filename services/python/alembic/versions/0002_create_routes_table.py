from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        "routes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),

        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),

        sa.Column("distance_km", sa.Float(), nullable=False),
        sa.Column("elevation_gain_m", sa.Integer(), nullable=False),
        sa.Column("total_time_min", sa.Integer(), nullable=False),
        sa.Column("difficulty", sa.Integer(), nullable=False),

        sa.Column("region", sa.String(length=200), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),

        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

def downgrade() -> None:
    op.drop_table("routes")
