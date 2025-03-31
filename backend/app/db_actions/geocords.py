from sqlalchemy.orm import Session
from app import schemas, models

def get_addresses_to_update(db: Session):
    return db.query(models.Address).filter(
        models.Address.longitude == None,
        models.Address.latitude == None
    ).all()

def update_address_with_geocords(db: Session, address_id: int, lat: float, lng: float):
    address = db.query(models.Address).filter(models.Address.id == address_id).first()
    address.latitude = lat
    address.longitude = lng
    db.commit()
    db.refresh(address)
    return address

