from fastapi import FastAPI, HTTPException, Depends
from typing import List, Annotated
from pydantic_settings import BaseSettings, SettingsConfigDict
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import models
import schemas

class Settings(BaseSettings):
    app_name: str = "FairNest API"
    model_config = SettingsConfigDict(env_file=".env")

# class AddressBase(BaseModel):
#     country: str
#     administrative_area: str
#     sub_administrative_area: Optional[str] = None
#     locality: str
#     postal_code: str
#     street: str
#     premise: Optional[str] = None
#     sub_premise: Optional[str] = None
    
# class AddressCreate(AddressBase):
#     pass

# class AddressResponse(AddressBase):
#     id: int

#     class Config:
#         from_attributes = True
    
# class ListingBase(BaseModel):
#     price: int = Field(..., gt=0)
#     bedrooms: int
#     bathrooms: float
#     square_feet: int
#     sale_status: str
#     acre_lot: Optional[float] = None
#     tour_available: bool
#     image_source: Optional[str] = None
    
# class ListingCreate(ListingBase):
#     address: AddressCreate

# class ListingResponse(ListingBase):
#     id: int
#     date_posted: datetime
#     address: AddressResponse

#     class Config:
#         from_attributes = True

def get_or_create_address(db: Session, address_data: schemas.AddressCreate):
    existing_address = db.query(models.Address).filter(
        models.Address.street == address_data.street,
        models.Address.locality == address_data.locality,
        models.Address.postal_code == address_data.postal_code
    ).first()
    
    if existing_address:
        return existing_address  # Return existing address if found

    new_address = models.Address(**address_data.model_dump())  # Convert Pydantic to dict
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

def create_listing(db: Session, listing_data: schemas.ListingCreate):
    address = get_or_create_address(db, listing_data.address)
    
    new_listing = models.Listing(
        price=listing_data.price,
        bedrooms=listing_data.bedrooms,
        bathrooms=listing_data.bathrooms,
        square_feet=listing_data.square_feet,
        sale_status=listing_data.sale_status,
        acre_lot=listing_data.acre_lot,
        tour_available=listing_data.tour_available,
        image_source=listing_data.image_source,
        address_id=address.id
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/listings", response_model=schemas.ListingResponse)
def create_listings(listing_data: schemas.ListingCreate, db: db_dependency):
    return create_listing(db, listing_data)