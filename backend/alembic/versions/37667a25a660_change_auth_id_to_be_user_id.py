"""Change auth_id to be user_id

Revision ID: 37667a25a660
Revises: a623761502bf
Create Date: 2025-05-06 15:24:30.107939

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '37667a25a660'
down_revision: Union[str, None] = 'a623761502bf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('favorites_auth_id_fkey', 'favorites', type_='foreignkey')
    op.drop_column('favorites', 'auth_id')
    op.drop_constraint('unique_address_id', 'property_listings', type_='unique')
    op.drop_constraint('unique_property_listing_constraint', 'property_listings', type_='unique')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_constraint('users_auth_id_key', 'users', type_='unique')
    op.drop_column('users', 'auth_id')
    op.drop_column('users', 'id')
    op.create_unique_constraint('uq_users_user_id', 'users', ['user_id'])
    op.create_foreign_key(
        'fk_favorites_user_id_users',
        'favorites',
        'users',
        ['user_id'],
        ['user_id'],
        ondelete='CASCADE'
    )


def downgrade() -> None:
    op.add_column('users', sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('users_id_seq'::regclass)"), autoincrement=True, nullable=False))
    op.add_column('users', sa.Column('auth_id', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.drop_constraint('uq_users_user_id', 'users', type_='unique')
    op.create_unique_constraint('users_auth_id_key', 'users', ['auth_id'])
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_unique_constraint('unique_property_listing_constraint', 'property_listings', ['address_id', 'price', 'sale_status'])
    op.create_unique_constraint('unique_address_id', 'property_listings', ['address_id'])
    op.add_column('favorites', sa.Column('auth_id', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.drop_constraint('fk_favorites_user_id_users', 'favorites', type_='foreignkey')
    op.create_foreign_key('favorites_auth_id_fkey', 'favorites', 'users', ['auth_id'], ['auth_id'])
