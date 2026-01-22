"""add_vac_points_to_routes

Revision ID: 0008
Revises: 7d3bb3c59923
Create Date: 2026-01-22 16:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0008'
down_revision: Union[str, None] = '7d3bb3c59923'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add vac_points column to routes table
    op.add_column('routes', sa.Column('vac_points', sa.Integer(), nullable=False, server_default='0'))
    
    # Backfill existing routes with calculated VAC points based on distance_km
    # VAC points = distance_km * 10
    op.execute("""
        UPDATE routes
        SET vac_points = CAST(distance_km * 10 AS INTEGER)
    """)


def downgrade() -> None:
    # Remove vac_points column from routes table
    op.drop_column('routes', 'vac_points')
