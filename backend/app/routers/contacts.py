from fastapi import APIRouter, HTTPException
from sqlalchemy import and_
from typing import List
from app import schemas, models
from app.database import db_dependency

router = APIRouter(prefix="/contacts", tags=["Contacts"])

@router.get("/", response_model=List[schemas.ContactResponse])
def get_contacts(
    db: db_dependency,
    skip: int = 0,
    limit: int = 10
):
    return db.query(models.Contact).offset(skip).limit(limit).all()

@router.get("/{contact_id}", response_model=schemas.ContactResponse)
def get_contact(db: db_dependency, contact_id: int = None):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id).first()
  
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return contact

@router.post("/", response_model=schemas.ContactResponse)
def create_contact(contact: schemas.ContactCreate, db: db_dependency):
    new_contact = models.Contact(
        email=contact.email,
        first_name=contact.first_name,
        last_name=contact.last_name,
        phone_number=contact.phone_number,
        message=contact.message
    )
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@router.delete("/{contact_id}")
def delete_contact(contact_id: int, db: db_dependency):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted"}