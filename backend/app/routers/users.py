from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from typing import List
from app import schemas, models
from app.database import db_dependency
from typing import Union

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[schemas.UserResponse])
def get_users(
    db: db_dependency,
    skip: int = 0,
    limit: int = 10
):

    return db.query(models.User).offset(skip).limit(limit).all()
    

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(db: db_dependency, user_id: Union[int, str] = None):
    if user_id is None:
        raise HTTPException(
            status_code=400, 
            detail="User identifier must be provided"
        )
    
    user = db.query(models.User).filter(or_(models.User.id == user_id, models.User.auth_id == user_id)).first()
  
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: db_dependency):
    # Check if user with same email or auth_id already exists
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

@router.delete("/{user_id}")
def delete_user(user_id: int, db: db_dependency):
    user = db.query(models.User).filter(or_(models.User.id == user_id, models.User.auth_id == user_id )).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}
