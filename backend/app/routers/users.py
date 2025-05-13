from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy import or_
from typing import List
from app import schemas, models
from app.database import db_dependency
from typing import Union
from app.dependencies import auth
from app.crud.listings import (
    get_base_listing_query,
    apply_field_filters,
    apply_range_filters,
    paginate,
)

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[schemas.UserResponse])
def get_users(
    db: db_dependency,
    auth_result: str = Security(auth.verify),
    skip: int = 0,
    limit: int = 10
):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    auth_id = auth_result["sub"]
    return db.query(models.User).offset(skip).limit(limit).all()
    

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(db: db_dependency, auth_result: str = Security(auth.verify), user_id: Union[int, str] = None):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    auth_id = auth_result["sub"]
    if user_id is None:
        raise HTTPException(
            status_code=400, 
            detail="User identifier must be provided"
        )
        
    if type(user_id) == str:
        user = db.query(models.User).filter(models.User.auth_id == user_id).first()
    else:
        user = db.query(models.User).filter(models.User.id == user_id).first()
  
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: db_dependency, auth_result: str = Security(auth.verify)):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    auth_id = auth_result["sub"]
    if auth_id != user.auth_id:
        raise HTTPException(status_code=403, detail="You do not have permission to create this user")
    
    existing_user_email = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user_email:
        raise HTTPException(
            status_code=400, 
            detail="Email already registered"
        )
    
    existing_user_auth = db.query(models.User).filter(models.User.auth_id == user.auth_id).first()
    if existing_user_auth:
        raise HTTPException(
            status_code=400, 
            detail="Authentication ID already in use"
        )
    
    new_user = models.User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        auth_id=user.auth_id
    )
    
    # Create new user
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user: schemas.UserUpdate, db: db_dependency, auth_result: str = Security(auth.verify)):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    auth_id = auth_result["sub"]
    if type(user_id) == str:
        user_to_update = db.query(models.User).filter(models.User.auth_id == user_id).first()
    else:
        user_to_update = db.query(models.User).filter(models.User.id == user_id).first()

    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_to_update.auth_id != auth_id:
        raise HTTPException(status_code=403, detail="You do not have permission to update this user")
    
    for key, value in user.dict(exclude_unset=True).items():
        setattr(user_to_update, key, value)
    
    db.commit()
    db.refresh(user_to_update)
    return user_to_update

@router.delete("/{user_id}")
def delete_user(user_id: int, db: db_dependency, auth_result: str = Security(auth.verify)):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    auth_id = auth_result["sub"]
    user = db.query(models.User).filter(or_(models.User.id == user_id, models.User.auth_id == user_id )).first()
    if not user or user.auth_id != auth_id:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}

@router.get(
    "/{user_id}/listings",
    response_model=schemas.PaginatedListingsResponse,
    summary="Get paginated listings for a specific user"
)
def get_user_listings(
    user_id: str,
    db: db_dependency,
    filters: schemas.ListingFilter = Depends(),
    skip: int = 0,
    limit: int = 10,
    auth_result: str = Security(auth.verify)
):
    if not auth_result and not auth_result["sub"]:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    auth_id = auth_result["sub"]
    current_user = db.query(models.User).filter(models.User.user_id == auth_id).first()
    
    print(f"Current user ID: {current_user.user_id}")
    print(f"Requested user ID: {user_id}")
    # if current_user.id != user_id and not current_user.is_admin:
    if current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these listings")

    query = get_base_listing_query(db)
    query = query.filter(models.Listing.user_id == user_id)

    query = apply_field_filters(query, filters)
    query = apply_range_filters(query, filters)

    # Paginate and return
    return paginate(query, skip, limit)
