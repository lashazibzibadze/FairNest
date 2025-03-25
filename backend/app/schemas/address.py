from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class AddressBase(BaseModel):
    country: str = Field(..., max_length=50)
    administrative_area: str = Field(..., max_length=50)
    sub_administrative_area: Optional[str] = Field(None, max_length=50)
    locality: str = Field(..., max_length=50)
    postal_code: str = Field(..., max_length=20)
    street: str = Field(..., max_length=100)
    premise: Optional[str] = Field(None, max_length=50)
    sub_premise: Optional[str] = Field(None, max_length=50)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)

class AddressCreate(AddressBase):
    pass

class AddressResponse(AddressBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
