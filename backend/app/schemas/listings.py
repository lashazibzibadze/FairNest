from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, Annotated
from .address import AddressResponse, AddressCreate

class ListingBase(BaseModel):
    price: int
    bedrooms: Optional[int] = None
    bathrooms: Optional[Annotated[Decimal, Field(None, ge=0, max_digits=3, decimal_places=1)]] = None
    square_feet: Optional[Annotated[Decimal, Field(None, ge=0, max_digits=10, decimal_places=2)]] = None
    sale_status: str = Field(..., max_length=255)
    acre_lot: Optional[Annotated[Decimal, Field(None, ge=0, max_digits=10, decimal_places=2)]] = None
    tour_available: bool = False
    image_source: Optional[str] = None
    realtor_link: Optional[str] = None
    date_posted: Optional[datetime] = None

class ListingCreate(ListingBase):
    address: AddressCreate

class ListingResponse(ListingBase):
    id: int
    address: AddressResponse
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class PaginatedListingsResponse(BaseModel):
    listings: list[ListingResponse]
    total_records: int
    total_pages: int
    current_page: int
    page_size: int
    model_config = ConfigDict(from_attributes=True)
        
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
    min_square_feet: Optional[float] = None
    max_square_feet: Optional[float] = None
    sale_status: Optional[str] = None
    min_acre_lot: Optional[float] = None
    max_acre_lot: Optional[float] = None
    tour_available: Optional[bool] = None

