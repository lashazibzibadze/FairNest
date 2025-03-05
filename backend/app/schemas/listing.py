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
