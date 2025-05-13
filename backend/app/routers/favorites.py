from fastapi import APIRouter, HTTPException, Security
from sqlalchemy import and_
from typing import List
from app import schemas, models
from app.database import db_dependency
from app.dependencies import auth

router = APIRouter(prefix="/favorites", tags=["Favorites"])

@router.get("/", response_model=List[schemas.FavoriteResponse])
def get_favorites(
    db: db_dependency,
    auth_result: str = Security(auth.verify),
    skip: int = 0,
    limit: int = 10
):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    print(auth_result["sub"])
    return db.query(models.Favorite).filter(models.Favorite.user_id == auth_result["sub"]).join(models.Listing).offset(skip).limit(limit).all()
    

@router.get("/{favorite_id}", response_model=schemas.FavoriteResponse)
def get_favorite(db: db_dependency, auth_result: str = Security(auth.verify), favorite_id: int = None):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    auth_id = auth_result["sub"]
    favorite = db.query(models.User).filter(models.Favorite.id == favorite_id).first()
  
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite listing not found")
    
    if favorite.user_id != auth_id:
        raise HTTPException(status_code=403, detail="You do not have permission to access this favorite")
    
    return favorite


@router.post("/", response_model=schemas.FavoriteResponse)
def create_favorite(listing_id: int, db: db_dependency, auth_result: str = Security(auth.verify)):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    auth_id = auth_result["sub"]
    existing_favorite = db.query(models.Favorite).filter(and_(models.Favorite.listing_id == listing_id, models.Favorite.user_id == auth_id)).first()
    if existing_favorite:
        raise HTTPException(
            status_code=400, 
            detail="User already favorited this listing"
        )
    
    new_favorite = models.Favorite(
        listing_id=listing_id,
        user_id=auth_id
    )
    
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

@router.delete("/{favorite_id}")
def delete_favorite(favorite_id: int, db: db_dependency, auth_result: str = Security(auth.verify)):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    auth_id = auth_result["sub"]
    favorite = db.query(models.Favorite).filter(and_(models.Favorite.id == favorite_id, models.User.user_id == auth_id)).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite listing not found")
    db.delete(favorite)
    db.commit()
    return {"message": "Favorite listing successfully deleted"}