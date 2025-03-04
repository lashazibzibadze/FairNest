from fastapi import FastAPI, HTTPException, Depends
from typing import List, Annotated
from pydantic_settings import BaseSettings, SettingsConfigDict
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from routers import listings
import models
import schemas

class Settings(BaseSettings):
    app_name: str = "FairNest API"
    model_config = SettingsConfigDict(env_file=".env")

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

app.include_router(listings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FairNest API!"}