from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from math import radians, cos
from app import schemas, models
from app.database import db_dependency
from app.task_queue.celery_app import app
import math
from decimal import Decimal
from datetime import datetime, timezone
from app.dependencies import auth
from app.crud.listings import (
    get_base_listing_query,
    apply_field_filters,
    apply_range_filters,
    paginate,
)
import numpy as np
from statsmodels import robust

router = APIRouter(prefix="/listings", tags=["Listings"])

def compute_fairness_rating(db: Session, listing: models.Listing, address: models.Address) -> Optional[schemas.FairnessRating]:
    if not listing.square_feet or listing.square_feet == 0:
        return None

    ppsf = listing.price / float(listing.square_feet)
    postal = address.postal_code

    # pull all ppsf in this ZIP
    rows = (
        db.query(models.Listing.price, models.Listing.square_feet)
          .join(models.Address)
          .filter(
                models.Address.postal_code == postal,
                models.Listing.square_feet > 0,
                models.Listing.id != listing.id,
          )
          .all()
    )
    # if no peers, we can’t score
    if not rows:
        return None

    ppsf_list = [price / float(sq) for price, sq in rows]
    median_ppsf = np.median(ppsf_list)
    mad_ppsf = robust.mad(np.array(ppsf_list))

    # if zero dispersion, can’t score
    if mad_ppsf == 0:
        return None

    modified_z = 0.6745 * (ppsf - median_ppsf) / mad_ppsf
    if modified_z < -0.4:
        return schemas.FairnessRating.GOOD
    elif modified_z <= 0.4:
        return schemas.FairnessRating.FAIR
    else:
        return schemas.FairnessRating.BAD
    
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
    if not new_address.latitude or not new_address.longitude:
        app.send_task("update_listings.tasks.update_address", args=[new_address.id, new_address.premise, new_address.street, new_address.locality, new_address.administrative_area], queue="update_listings")
    return new_address

def get_listings_by_address(db: Session, address_id: int):
    return db.query(models.Listing).filter(models.Listing.address_id == address_id).all()

@router.get("/", response_model=schemas.PaginatedListingsResponse)
def get_listings(
    db: db_dependency,
    filters: schemas.ListingFilter = Depends(),
    skip: int = 0,
    limit: int = 10,
):
    q = get_base_listing_query(db)
    q = apply_field_filters(q, filters)
    q = apply_range_filters(q, filters)
    return paginate(q, skip, limit)

@router.get("/{listing_id}", response_model=schemas.ListingResponse)
def get_listing(listing_id: int, db: db_dependency):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.post("/", response_model=schemas.ListingResponse)
def create_listing(listing_data: schemas.ListingCreate, db: db_dependency, auth_result: str = Security(auth.verify)):
    address = get_or_create_address(db, listing_data.address)
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    auth_id = auth_result["sub"]
    
    new_listing = models.Listing(
        price=listing_data.price,
        bedrooms=listing_data.bedrooms,
        bathrooms=listing_data.bathrooms,
        square_feet=listing_data.square_feet,
        sale_status=listing_data.sale_status,
        acre_lot=listing_data.acre_lot,
        tour_available=listing_data.tour_available,
        image_source=listing_data.image_source,
        address_id=address.id,
        user_id=auth_id
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    rating = compute_fairness_rating(db, new_listing, address)
    if rating is not None:
        new_listing.fairness_rating = rating
        new_listing.fairness_rating_updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(new_listing)
    return new_listing

@router.put("/{listing_id}", response_model=schemas.ListingResponse)
def update_listing(listing_id: int, listing_data: schemas.ListingCreate, db: db_dependency, auth_result: str = Security(auth.verify)):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    auth_id = auth_result["sub"]
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id, models.Listing.user_id == auth_id).first()
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
    
    rating = compute_fairness_rating(db, listing, address)
    if rating is not None and listing.fairness_rating != rating:
        listing.fairness_rating = rating
        listing.fairness_rating_updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(listing)
    return listing

@router.delete("/{listing_id}")
def delete_listing(listing_id: int, db: db_dependency, auth_result: str = Security(auth.verify)):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    auth_id = auth_result["sub"]
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id, models.Listing.user_id == auth_id).first()
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

@router.get("/fairness/{listing_id}", response_model=schemas.ListingFairnessResponse)
def get_listing_fairness(listing_id: int, db: db_dependency):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    min_sqft = float(listing.square_feet) * 0.8
    max_sqft = float(listing.square_feet) * 1.2

    
    similar = (
        db.query(models.Listing)
        .join(models.Address)
        .filter(models.Address.postal_code == listing.address.postal_code)
        .filter(models.Listing.id != listing.id)
    )

    if listing.bedrooms is not None:
        similar = similar.filter(
            models.Listing.bedrooms.between(listing.bedrooms - 1, listing.bedrooms + 1)
        )

    if listing.bathrooms is not None:
        similar = similar.filter(
            models.Listing.bathrooms.between(float(listing.bathrooms) - 1.0, float(listing.bathrooms) + 1.0)
        )

    if listing.square_feet is not None:
        min_sqft = listing.square_feet * Decimal('0.8')
        max_sqft = listing.square_feet * Decimal('1.2')

        similar = similar.filter(
            models.Listing.square_feet.between(min_sqft, max_sqft)
        )

    similar = similar.options(joinedload(models.Listing.address)).limit(10).all()

    return {
        "listing_id": listing.id,
        "fairness_rating": listing.fairness_rating,
        "fairness_rating_updated_at": listing.fairness_rating_updated_at,
        "similar_listings": similar
    }


@router.get("/nearby-listings/", response_model=List[schemas.ListingResponse])
def get_nearby_listings(listing_id: int, unit: str, radius: float, db: db_dependency):
    if unit not in ("km", "mile"):
        raise HTTPException(status_code=400, detail="Unit must be either 'km' or 'mile'")

    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing or not listing.address or not listing.address.latitude or not listing.address.longitude:
        raise HTTPException(status_code=404, detail="Listing not found or missing coordinates")

    latitude = float(listing.address.latitude)
    longitude = float(listing.address.longitude)

    radius_km = radius * 1.60934 if unit == "mile" else radius

    lat_min, lat_max, lon_min, lon_max = bounding_box(latitude, longitude, radius_km)

    listings = (
        db.query(models.Listing)
        .join(models.Address)
        .filter(
            models.Address.latitude.between(lat_min, lat_max),
            models.Address.longitude.between(lon_min, lon_max)
        )
        .all()
    )
    return listings

@router.get(
    "/stats/{postal_code}",
    response_model=schemas.ZipStatsResponse,
    summary="Get average price and sqft for a ZIP code",
)
def get_zip_stats(postal_code: str, db: db_dependency):
    # join Address → Listing to compute averages
    avg_price = (
        db.query(func.avg(models.Listing.price))
          .join(models.Address)
          .filter(models.Address.postal_code == postal_code)
          .scalar()
    )
    avg_sqft = (
        db.query(func.avg(models.Listing.square_feet))
          .join(models.Address)
          .filter(
              models.Address.postal_code == postal_code,
              models.Listing.square_feet.isnot(None)
          )
          .scalar()
    )
    if avg_price is None and avg_sqft is None:
        raise HTTPException(404, f"No listings found for ZIP {postal_code}")

    return schemas.ZipStatsResponse(
        postal_code=postal_code,
        average_price=avg_price,
        average_square_feet=avg_sqft,
    )

def haversine(lat1, lon1, lat2, lon2, unit="mile"):
    R = 6371 if unit == "km" else 3958.8
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def bounding_box(lat, lon, radius_km):
    delta_lat = radius_km / 111 
    delta_lon = radius_km / (111 * cos(radians(lat)))
    return lat - delta_lat, lat + delta_lat, lon - delta_lon, lon + delta_lon