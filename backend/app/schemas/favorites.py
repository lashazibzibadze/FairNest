from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from .listings import ListingResponse

class FavoriteBase(BaseModel):
    user_id: int
    listing_id: int

class FavoriteCreate(FavoriteBase):
    pass

class FavoriteResponse(FavoriteBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    listing: Optional[ListingResponse] = None

    model_config = ConfigDict(from_attributes=True)