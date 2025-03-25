from sqlalchemy.orm import Session
from app import schemas, models

def get_listings_to_update(db: Session):
    return db.query(models.Address).filter(
        models.Address.longitude == None,
        models.Address.latitude == None
    ).all()

def update_listing_with_geocords(db: Session, listing_id: int, lat: float, lng: float):
    listing = db.query(models.Address).filter(models.Address.id == listing_id).first()
    listing.latitude = lat
    listing.longitude = lng
    db.commit()
    db.refresh(listing)
    return listing