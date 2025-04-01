from fastapi import FastAPI
from database import engine
from routers import listings
from fastapi.middleware.cors import CORSMiddleware
import models

# class Settings(BaseSettings):
#     app_name: str = "FairNest API"
#     model_config = SettingsConfigDict(env_file=".env")

# settings = Settings()

app = FastAPI(
    title="FairNest API",
    summary="API for FairNest, where everyone has a fair chance to find their dream home.",
    version="0.0.1"
)

origins = [
    "http://localhost:3000", 
    "http://localhost:3001", 
    "http://localhost:3002", 
    "http://localhost:3003", 
    "http://localhost:3004", 
    "http://localhost:3005", 
    "http://localhost:3006", 
]

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(listings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FairNest API!"}