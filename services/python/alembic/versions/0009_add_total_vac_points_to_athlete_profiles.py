"""add_total_vac_points_to_athlete_profiles

Revision ID: 0009
Revises: 0008
Create Date: 2026-01-22 17:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0009'
down_revision: Union[str, None] = '0008'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add total_vac_points column to athlete_profiles table
    op.add_column('athlete_profiles', sa.Column('total_vac_points', sa.Integer(), nullable=False, server_default='0'))
    
    # Backfill existing athlete profiles with sum of their route VAC points
    op.execute("""
        UPDATE athlete_profiles ap
        SET total_vac_points = COALESCE(
            (SELECT SUM(vac_points) FROM routes WHERE user_id = ap.user_id),
            0
        )
    """)


def downgrade() -> None:
    # Remove total_vac_points column from athlete_profiles table
    op.drop_column('athlete_profiles', 'total_vac_points')
