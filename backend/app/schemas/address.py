from pydantic import BaseModel
from typing import Optional

class AddressBase(BaseModel):
    country: str
    administrative_area: str
    sub_administrative_area: Optional[str] = None
    locality: str
    postal_code: str
    street: str
    premise: Optional[str] = None
    sub_premise: Optional[str] = None

class AddressCreate(AddressBase):
    pass

class AddressResponse(AddressBase):
    id: int

    class Config:
        from_attributes = True
