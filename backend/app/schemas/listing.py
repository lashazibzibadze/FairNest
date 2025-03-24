from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from .address import AddressCreate, AddressResponse

class ListingBase(BaseModel):
    price: int = Field(..., gt=0)
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[int] = None
    sale_status: str
    acre_lot: Optional[float] = None
    tour_available: bool
    image_source: Optional[str] = None

class ListingCreate(ListingBase):
    address: AddressCreate 

class ListingResponse(ListingBase):
    id: int
    date_posted: Optional[datetime] = None
    address: AddressResponse 

    class Config:
        from_attributes = True
class ListingFilter(BaseModel):
    country: Optional[str] = None
    postal_code: Optional[str] = None
    street: Optional[str] = None
    administrative_area: Optional[str] = None
    locality: Optional[str] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    min_bedrooms: Optional[int] = None
    max_bedrooms: Optional[int] = None
    min_bathrooms: Optional[float] = None
    max_bathrooms: Optional[float] = None
    min_square_feet: Optional[int] = None
    max_square_feet: Optional[int] = None
    sale_status: Optional[str] = None
    min_acre_lot: Optional[float] = None
    max_acre_lot: Optional[float] = None
    tour_available: Optional[bool] = None

