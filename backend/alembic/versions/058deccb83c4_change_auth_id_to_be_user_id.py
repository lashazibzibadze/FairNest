"""Change auth_id to be user_id

Revision ID: 058deccb83c4
Revises: 37667a25a660
Create Date: 2025-05-06 15:29:47.151811

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '058deccb83c4'
down_revision: Union[str, None] = '37667a25a660'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('fk_favorites_user_id_users', 'favorites', type_='foreignkey')
    op.create_foreign_key(None, 'favorites', 'users', ['user_id'], ['user_id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'favorites', type_='foreignkey')
    op.create_foreign_key('fk_favorites_user_id_users', 'favorites', 'users', ['user_id'], ['user_id'], ondelete='CASCADE')
    # ### end Alembic commands ###
