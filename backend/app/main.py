from fastapi import FastAPI, HTTPException, Depends
from typing import List, Annotated
from pydantic_settings import BaseSettings, SettingsConfigDict
from database import SessionLocal, engine
from sqlalchemy.orm import Session

class Settings(BaseSettings):
    app_name: str = "FairNest API"
    model_config = SettingsConfigDict(env_file=".env")
    
app = FastAPI()

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