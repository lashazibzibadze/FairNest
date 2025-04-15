from fastapi import APIRouter, HTTPException
from sqlalchemy import and_
from typing import List
from app import schemas, models
from app.database import db_dependency

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get("/", response_model=List[schemas.UserResponse])
def get_favorites(
    db: db_dependency,
    skip: int = 0,
    limit: int = 10
):

    return db.query(models.Favorite).offset(skip).limit(limit).all()
    

@router.get("/{favorite_id}", response_model=schemas.FavoriteResponse)
def get_favorite(db: db_dependency, favorite_id: int = None):
    
    favorite = db.query(models.User).filter(models.Favorite.id == favorite_id).first()
  
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite listing not found")
    
    return favorite


@router.post("/", response_model=schemas.UserResponse)
def create_favorite(listing_id: int, user_id: int, db: db_dependency):
    # Check if user with same email or auth_id already exists
    existing_favorite = db.query(models.Favorite).filter(and_(models.Favorite.listing_id == listing_id, models.User.id == user_id)).first()
    if existing_favorite:
        raise HTTPException(
            status_code=400, 
            detail="User already favorited this listing"
        )
    
    new_favorite = models.Favorite(
        listing_id=listing_id,
        user_id=user_id
    )
    
    # Create new user
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

@router.delete("/{favorite_id}")
def delete_favorite(favorite_id: int, db: db_dependency):
    favorite = db.query(models.Favorite).filter(models.Favorite.id == favorite_id).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite listing not found")
    db.delete(favorite)
    db.commit()
    return {"message": "Favorite listing deleted"}