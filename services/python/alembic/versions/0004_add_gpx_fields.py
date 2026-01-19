from alembic import op
import sqlalchemy as sa

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column("routes", sa.Column("gpx_filename", sa.String(length=255), nullable=True))
    op.add_column("routes", sa.Column("gpx_content", sa.Text(), nullable=True))
    op.add_column("routes", sa.Column("track_geojson", sa.JSON(), nullable=True))

    op.add_column("routes", sa.Column("elevation_loss_m", sa.Integer(), nullable=True))
    op.add_column("routes", sa.Column("min_altitude_m", sa.Integer(), nullable=True))
    op.add_column("routes", sa.Column("max_altitude_m", sa.Integer(), nullable=True))

def downgrade() -> None:
    op.drop_column("routes", "max_altitude_m")
    op.drop_column("routes", "min_altitude_m")
    op.drop_column("routes", "elevation_loss_m")
    op.drop_column("routes", "track_geojson")
    op.drop_column("routes", "gpx_content")
    op.drop_column("routes", "gpx_filename")
