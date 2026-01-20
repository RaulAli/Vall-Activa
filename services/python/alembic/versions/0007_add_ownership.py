"""add ownership to routes and businesses

Revision ID: 0007
Revises: 0006
Create Date: 2026-01-19 21:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0007'
down_revision = '0006'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Add user_id to routes
    op.add_column('routes', sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.create_foreign_key('fk_routes_user_id', 'routes', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_index(op.f('ix_routes_user_id'), 'routes', ['user_id'], unique=False)

    # 2. Add owner_id to businesses
    op.add_column('businesses', sa.Column('owner_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.create_foreign_key('fk_businesses_owner_id', 'businesses', 'users', ['owner_id'], ['id'], ondelete='CASCADE')
    op.create_index(op.f('ix_businesses_owner_id'), 'businesses', ['owner_id'], unique=False)

    # Note: Using nullable=True initially to avoid errors if there are existing rows (though DB should be clean)
    # Then we could make them nullable=False
    op.execute("UPDATE routes SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL")
    op.execute("UPDATE businesses SET owner_id = (SELECT id FROM users LIMIT 1) WHERE owner_id IS NULL")
    
    # op.alter_column('routes', 'user_id', nullable=False)
    # op.alter_column('businesses', 'owner_id', nullable=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_businesses_owner_id'), table_name='businesses')
    op.drop_constraint('fk_businesses_owner_id', 'businesses', type_='foreignkey')
    op.drop_column('businesses', 'owner_id')
    
    op.drop_index(op.f('ix_routes_user_id'), table_name='routes')
    op.drop_constraint('fk_routes_user_id', 'routes', type_='foreignkey')
    op.drop_column('routes', 'user_id')
