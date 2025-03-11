from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DECIMAL, BigInteger, Text, DateTime, func
from sqlalchemy.orm import relationship
from database import Base


class Listing(Base):
    __tablename__ = "property_listings"

    id = Column(Integer, primary_key=True, index=True)
    price = Column(BigInteger, nullable=False)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(DECIMAL(3,1), nullable=True)
    square_feet = Column(Integer, nullable=True)
    sale_status = Column(String(255), nullable=False)
    acre_lot = Column(DECIMAL(6,4), nullable=True)
    tour_available = Column(Boolean, default=False)
    image_source = Column(Text, nullable=True)

    address_id = Column(Integer, ForeignKey("address.id"), nullable=False)
    address = relationship("Address", back_populates="listings")

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
    created_at = Column(DateTime, default=func.now())

    listings = relationship("Listing", back_populates="address", cascade="all, delete-orphan")
