from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas, models
from app.database import db_dependency
import math

router = APIRouter(prefix="/listings", tags=["Listings"])

def get_or_create_address(db: Session, address_data: schemas.AddressCreate):
    existing_address = db.query(models.Address).filter(
        models.Address.street == address_data.street,
        models.Address.locality == address_data.locality,
        models.Address.postal_code == address_data.postal_code
    ).first()
    
    if existing_address:
        return existing_address

    new_address = models.Address(**address_data.model_dump())
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

def get_listings_by_address(db: Session, address_id: int):
    return db.query(models.Listing).filter(models.Listing.address_id == address_id).all()

@router.get("/", response_model=List[schemas.ListingResponse])
def get_listings(
    db: db_dependency,
    filters: schemas.ListingFilter = Depends(),
    skip: int = 0,
    limit: int = 10
):
    query = db.query(models.Listing).join(models.Address)

    filter_mappings = {
        "country": models.Address.country,
        "postal_code": models.Address.postal_code,
        "street": models.Address.street,
        "administrative_area": models.Address.administrative_area,
        "locality": models.Address.locality,
        "sale_status": models.Listing.sale_status,
        "tour_available": models.Listing.tour_available
    }

    range_filters = {
        "min_price": (models.Listing.price, ">="),
        "max_price": (models.Listing.price, "<="),
        "min_bedrooms": (models.Listing.bedrooms, ">="),
        "max_bedrooms": (models.Listing.bedrooms, "<="),
        "min_bathrooms": (models.Listing.bathrooms, ">="),
        "max_bathrooms": (models.Listing.bathrooms, "<="),
        "min_square_feet": (models.Listing.square_feet, ">="),
        "max_square_feet": (models.Listing.square_feet, "<="),
        "min_acre_lot": (models.Listing.acre_lot, ">="),
        "max_acre_lot": (models.Listing.acre_lot, "<="),
    }

    for param, column in filter_mappings.items():
        value = getattr(filters, param)
        if value is not None:
            query = query.filter(column == value)

    for param, (column, operator) in range_filters.items():
        value = getattr(filters, param)
        if value is not None:
            if operator == ">=":
                query = query.filter(column >= value)
            elif operator == "<=":
                query = query.filter(column <= value)

    return query.offset(skip).limit(limit).all()

@router.get("/{listing_id}", response_model=schemas.ListingResponse)
def get_listing(listing_id: int, db: db_dependency):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.post("/", response_model=schemas.ListingResponse)
def create_listing(listing_data: schemas.ListingCreate, db: db_dependency):
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

@router.put("/{listing_id}", response_model=schemas.ListingResponse)
def update_listing(listing_id: int, listing_data: schemas.ListingCreate, db: db_dependency):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    address = get_or_create_address(db, listing_data.address)
    
    listing.price = listing_data.price
    listing.bedrooms = listing_data.bedrooms
    listing.bathrooms = listing_data.bathrooms
    listing.square_feet = listing_data.square_feet
    listing.sale_status = listing_data.sale_status
    listing.acre_lot = listing_data.acre_lot
    listing.tour_available = listing_data.tour_available
    listing.image_source = listing_data.image_source
    listing.address_id = address.id
    
    db.commit()
    db.refresh(listing)
    return listing

@router.delete("/{listing_id}")
def delete_listing(listing_id: int, db: db_dependency):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    db.delete(listing)
    db.commit()
    return {"message": "Listing deleted"}

@router.get("/address/{address_id}", response_model=List[schemas.ListingResponse])
def get_listings_for_address(address_id: int, db: db_dependency):
    listings = get_listings_by_address(db, address_id)
    if not listings:
        raise HTTPException(status_code=404, detail="No listings found for this address")
    return listings

@router.get("/nearby-listings/")
def get_nearby_listings(listing_id: int, unit: str, radius: float, db: db_dependency):
    if unit != "km" and unit != "mile":
        raise HTTPException(status_code=400, detail="Unit must be either 'km' or 'mile'")
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if not listing.address.latitude or not listing.address.longitude:
        raise HTTPException(status_code=400, detail="Listing does not have latitude and longitude")
    
    longitude = float(listing.address.longitude)
    latitude = float(listing.address.latitude)
    listings = (
        db.query(models.Listing)
        .join(models.Address)
        .filter(models.Address.latitude.isnot(None), models.Address.longitude.isnot(None))
        .all()
    )

    nearby_listings = []
    for listing in listings:
        if listing.address.latitude and listing.address.longitude:
            distance = haversine(latitude, longitude, float(listing.address.latitude), float(listing.address.longitude), unit)
            if distance <= radius:
                nearby_listings.append({
                    "id": listing.id,
                    "price": listing.price,
                    "bedrooms": listing.bedrooms,
                    "bathrooms": listing.bathrooms,
                    "square_feet": listing.square_feet,
                    "sale_status": listing.sale_status,
                    "acre_lot": listing.acre_lot,
                    "tour_available": listing.tour_available,
                    "image_source": listing.image_source,
                    "address": {
                        "street": listing.address.street,
                        "locality": listing.address.locality,
                        "postal_code": listing.address.postal_code,
                        "latitude": listing.address.latitude,
                        "longitude": listing.address.longitude,
                    },
                    "distance": distance,
                    "unit": unit,
                })
    
    return {"nearby_listings": sorted(nearby_listings, key=lambda x: x["distance"])[1:] }

def haversine(lat1, lon1, lat2, lon2, unit="mile"):
    R = 6371 if unit == "km" else 3958.8
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c