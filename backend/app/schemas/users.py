from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class UserBase(BaseModel):
    auth_id: str = Field(..., max_length=255)
    email: str = Field(..., max_length=255)
    first_name: str = Field(..., max_length=50)
    last_name: str = Field(..., max_length=50)
    phone_number: Optional[str] = Field(None, max_length=20)

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)