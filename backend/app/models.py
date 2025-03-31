from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DECIMAL, BigInteger, Text, DateTime, UniqueConstraint, func
from sqlalchemy.orm import relationship
from database import Base


class Listing(Base):
    __tablename__ = "property_listings"

    id = Column(Integer, primary_key=True, index=True)
    price = Column(BigInteger, nullable=False)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(DECIMAL(3,1), nullable=True)
    square_feet = Column(DECIMAL(10,2), nullable=True)
    sale_status = Column(String(255), nullable=False)
    acre_lot = Column(DECIMAL(10,2), nullable=True)
    tour_available = Column(Boolean, default=False)
    image_source = Column(Text, nullable=True)
    realtor_link = Column(Text, nullable=True)
    date_posted = Column(DateTime, nullable=True, default=func.now())
    
    created_at = Column(DateTime, nullable=True, default=func.now())
    updated_at = Column(DateTime, nullable=True, default=func.now(), onupdate=func.now())
    
    address_id = Column(Integer, ForeignKey("address.id"), nullable=False)
    address = relationship("Address", back_populates="listings")

    favorites = relationship("Favorite", back_populates="listing")

    __tarble_args__ = (
        UniqueConstraint(
            'address_id', 'price', 'sale_status', name="unique_property_listing_constraint"
        ),
    )
    


class Address(Base):
    __tablename__ = "address"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(50), nullable=False)
    administrative_area = Column(String(50), nullable=False)
    sub_administrative_area = Column(String(50), nullable=True)
    locality = Column(String(50), nullable=False)
    postal_code = Column(String(20), nullable=False)
    street = Column(String(100), nullable=False)
    premise = Column(String(50), nullable=True)
    sub_premise = Column(String(50), nullable=True)
    latitude = Column(DECIMAL(10,7), nullable=True)
    longitude = Column(DECIMAL(10,7), nullable=True)
    
    created_at = Column(DateTime, nullable=True, default=func.now())
    updated_at = Column(DateTime, nullable=True, default=func.now(), onupdate=func.now())

    listings = relationship("Listing", back_populates="address", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint (
            'country', 'administrative_area', 'sub_administrative_area', 'locality', 'postal_code', 'street', 'premise', 'sub_premise',
            name = 'unique_adress_constraint'
        ),
    )


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("property_listings.id"), nullable=False)
    
    created_at = Column(DateTime, nullable=True, default=func.now())
    updated_at = Column(DateTime, nullable=True, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="favorites")
    listing = relationship("Listing", back_populates="favorites")


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    auth_id = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    phone_number = Column(String(20), nullable=True)
    
    created_at = Column(DateTime, nullable=True, default=func.now())
    updated_at = Column(DateTime, nullable=True, default=func.now(), onupdate=func.now())
    
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")


class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)
    message = Column(Text, nullable=False)
    
    created_at = Column(DateTime, nullable=True, default=func.now())
    updated_at = Column(DateTime, nullable=True, default=func.now(), onupdate=func.now())


class ListingTest(Base):
    __tablename__ = "property_listing_test_table"

    id = Column(Integer, primary_key=True, index=True)
    price = Column(BigInteger, nullable=False)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(DECIMAL(3,1), nullable=True)
    square_feet = Column(Integer, nullable=True)
    sale_status = Column(String(255), nullable=False)
    acre_lot = Column(DECIMAL(6,4), nullable=True)
    tour_available = Column(Boolean, default=False)
    image_source = Column(Text, nullable=True)
    date_posted = Column(DateTime, nullable=True, default=func.now())
    
    created_at = Column(DateTime, nullable=True, default=func.now())
    updated_at = Column(DateTime, nullable=True, default=func.now(), onupdate=func.now())
    
    address_id = Column(Integer, ForeignKey("address_test_table.id"), nullable=False)
    address = relationship("AddressTest", back_populates="listings")
    
class AddressTest(Base):
    __tablename__ = "address_test_table"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(50), nullable=False)
    administrative_area = Column(String(50), nullable=False)
    sub_administrative_area = Column(String(50), nullable=True)
    locality = Column(String(50), nullable=False)
    postal_code = Column(String(20), nullable=False)
    street = Column(String(100), nullable=False)
    premise = Column(String(50), nullable=True)
    sub_premise = Column(String(50), nullable=True)
    latitude = Column(DECIMAL(10,7), nullable=True)
    longitude = Column(DECIMAL(10,7), nullable=True)
    
    created_at = Column(DateTime, nullable=True, default=func.now())
    updated_at = Column(DateTime, nullable=True, default=func.now(), onupdate=func.now())

    listings = relationship("ListingTest", back_populates="address", cascade="all, delete-orphan")
