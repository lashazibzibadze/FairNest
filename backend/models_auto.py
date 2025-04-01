from typing import List, Optional

from sqlalchemy import BigInteger, Boolean, Column, DateTime, Double, ForeignKeyConstraint, Index, Integer, LargeBinary, Numeric, PrimaryKeyConstraint, Sequence, String, Table, Text, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import OID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import datetime
import decimal

class Base(DeclarativeBase):
    pass


class Address(Base):
    __tablename__ = 'address'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='address_test_table_pkey'),
        UniqueConstraint('country', 'administrative_area', 'sub_administrative_area', 'locality', 'postal_code', 'street', 'premise', 'sub_premise', name='unique_address_constraint'),
        Index('ix_address_id', 'id')
    )

    id: Mapped[int] = mapped_column(Integer, Sequence('address_test_table_id_seq'), primary_key=True)
    country: Mapped[str] = mapped_column(String)
    administrative_area: Mapped[str] = mapped_column(String)
    locality: Mapped[str] = mapped_column(String)
    postal_code: Mapped[str] = mapped_column(String)
    street: Mapped[str] = mapped_column(String)
    sub_administrative_area: Mapped[Optional[str]] = mapped_column(String)
    premise: Mapped[Optional[str]] = mapped_column(String)
    sub_premise: Mapped[Optional[str]] = mapped_column(String)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    latitude: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 7))
    longitude: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 7))
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    property_listings: Mapped[List['PropertyListings']] = relationship('PropertyListings', back_populates='address')


class AddressTestTable(Base):
    __tablename__ = 'address_test_table'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='address_test_table_pkey1'),
        Index('ix_address_test_table_id', 'id')
    )

    id: Mapped[int] = mapped_column(Integer, Sequence('address_test_table_id_seq1'), primary_key=True)
    country: Mapped[str] = mapped_column(String)
    administrative_area: Mapped[str] = mapped_column(String)
    locality: Mapped[str] = mapped_column(String)
    postal_code: Mapped[str] = mapped_column(String)
    street: Mapped[str] = mapped_column(String)
    sub_administrative_area: Mapped[Optional[str]] = mapped_column(String, server_default=text("''::character varying"))
    premise: Mapped[Optional[str]] = mapped_column(String)
    sub_premise: Mapped[Optional[str]] = mapped_column(String, server_default=text("''::character varying"))
    latitude: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 7))
    longitude: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 7))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    property_listing_test_table: Mapped[List['PropertyListingTestTable']] = relationship('PropertyListingTestTable', back_populates='address')


class CeleryTaskmeta(Base):
    __tablename__ = 'celery_taskmeta'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='celery_taskmeta_pkey'),
        UniqueConstraint('task_id', name='celery_taskmeta_task_id_key')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[Optional[str]] = mapped_column(String(155))
    status: Mapped[Optional[str]] = mapped_column(String(50))
    result: Mapped[Optional[bytes]] = mapped_column(LargeBinary)
    date_done: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    traceback: Mapped[Optional[str]] = mapped_column(Text)
    name: Mapped[Optional[str]] = mapped_column(String(155))
    args: Mapped[Optional[bytes]] = mapped_column(LargeBinary)
    kwargs: Mapped[Optional[bytes]] = mapped_column(LargeBinary)
    worker: Mapped[Optional[str]] = mapped_column(String(155))
    retries: Mapped[Optional[int]] = mapped_column(Integer)
    queue: Mapped[Optional[str]] = mapped_column(String(155))


class CeleryTasksetmeta(Base):
    __tablename__ = 'celery_tasksetmeta'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='celery_tasksetmeta_pkey'),
        UniqueConstraint('taskset_id', name='celery_tasksetmeta_taskset_id_key')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    taskset_id: Mapped[Optional[str]] = mapped_column(String(155))
    result: Mapped[Optional[bytes]] = mapped_column(LargeBinary)
    date_done: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)


class Contacts(Base):
    __tablename__ = 'contacts'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='contacts_pkey'),
        Index('ix_contacts_id', 'id')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String)
    message: Mapped[str] = mapped_column(Text)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    phone_number: Mapped[Optional[str]] = mapped_column(String(20))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)


t_pg_stat_statements = Table(
    'pg_stat_statements', Base.metadata,
    Column('userid', OID),
    Column('dbid', OID),
    Column('toplevel', Boolean),
    Column('queryid', BigInteger),
    Column('query', Text),
    Column('plans', BigInteger),
    Column('total_plan_time', Double(53)),
    Column('min_plan_time', Double(53)),
    Column('max_plan_time', Double(53)),
    Column('mean_plan_time', Double(53)),
    Column('stddev_plan_time', Double(53)),
    Column('calls', BigInteger),
    Column('total_exec_time', Double(53)),
    Column('min_exec_time', Double(53)),
    Column('max_exec_time', Double(53)),
    Column('mean_exec_time', Double(53)),
    Column('stddev_exec_time', Double(53)),
    Column('rows', BigInteger),
    Column('shared_blks_hit', BigInteger),
    Column('shared_blks_read', BigInteger),
    Column('shared_blks_dirtied', BigInteger),
    Column('shared_blks_written', BigInteger),
    Column('local_blks_hit', BigInteger),
    Column('local_blks_read', BigInteger),
    Column('local_blks_dirtied', BigInteger),
    Column('local_blks_written', BigInteger),
    Column('temp_blks_read', BigInteger),
    Column('temp_blks_written', BigInteger),
    Column('blk_read_time', Double(53)),
    Column('blk_write_time', Double(53)),
    Column('temp_blk_read_time', Double(53)),
    Column('temp_blk_write_time', Double(53)),
    Column('wal_records', BigInteger),
    Column('wal_fpi', BigInteger),
    Column('wal_bytes', Numeric),
    Column('jit_functions', BigInteger),
    Column('jit_generation_time', Double(53)),
    Column('jit_inlining_count', BigInteger),
    Column('jit_inlining_time', Double(53)),
    Column('jit_optimization_count', BigInteger),
    Column('jit_optimization_time', Double(53)),
    Column('jit_emission_count', BigInteger),
    Column('jit_emission_time', Double(53))
)


t_pg_stat_statements_info = Table(
    'pg_stat_statements_info', Base.metadata,
    Column('dealloc', BigInteger),
    Column('stats_reset', DateTime(True))
)


class Users(Base):
    __tablename__ = 'users'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='users_pkey'),
        UniqueConstraint('auth_id', name='users_auth_id_key'),
        UniqueConstraint('email', name='users_email_key'),
        Index('ix_users_id', 'id')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    auth_id: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255))
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20))


class PropertyListingTestTable(Base):
    __tablename__ = 'property_listing_test_table'
    __table_args__ = (
        ForeignKeyConstraint(['address_id'], ['address_test_table.id'], name='property_listing_test_table_address_id_fkey1'),
        PrimaryKeyConstraint('id', name='property_listing_test_table_pkey1'),
        Index('ix_property_listing_test_table_id', 'id')
    )

    id: Mapped[int] = mapped_column(Integer, Sequence('property_listing_test_table_id_seq1'), primary_key=True)
    price: Mapped[int] = mapped_column(BigInteger)
    sale_status: Mapped[str] = mapped_column(String(255))
    address_id: Mapped[int] = mapped_column(Integer)
    bedrooms: Mapped[Optional[int]] = mapped_column(Integer)
    bathrooms: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric)
    square_feet: Mapped[Optional[int]] = mapped_column(Integer)
    acre_lot: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric)
    tour_available: Mapped[Optional[bool]] = mapped_column(Boolean)
    image_source: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    date_posted: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    address: Mapped['AddressTestTable'] = relationship('AddressTestTable', back_populates='property_listing_test_table')


class PropertyListings(Base):
    __tablename__ = 'property_listings'
    __table_args__ = (
        ForeignKeyConstraint(['address_id'], ['address.id'], name='property_listing_test_table_address_id_fkey'),
        PrimaryKeyConstraint('id', name='property_listing_test_table_pkey'),
        Index('ix_property_listings_id', 'id')
    )

    id: Mapped[int] = mapped_column(Integer, Sequence('property_listing_test_table_id_seq'), primary_key=True)
    price: Mapped[int] = mapped_column(BigInteger)
    sale_status: Mapped[str] = mapped_column(String(255))
    address_id: Mapped[int] = mapped_column(Integer)
    bedrooms: Mapped[Optional[int]] = mapped_column(Integer)
    bathrooms: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric)
    square_feet: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric)
    acre_lot: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric)
    tour_available: Mapped[Optional[bool]] = mapped_column(Boolean)
    image_source: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    realtor_link: Mapped[Optional[str]] = mapped_column(Text)
    date_posted: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    address: Mapped['Address'] = relationship('Address', back_populates='property_listings')


t_favorites = Table(
    'favorites', Base.metadata,
    Column('user_id', Integer, nullable=False),
    Column('id', Integer, nullable=False),
    Column('listing_id', Integer, nullable=False),
    Column('created_at', DateTime),
    Column('updated_at', DateTime),
    ForeignKeyConstraint(['listing_id'], ['property_listings.id'], name='favorites_listing_id_fkey'),
    ForeignKeyConstraint(['user_id'], ['users.id'], name='favorites_user_id_fkey'),
    Index('ix_favorites_id', 'id')
)
