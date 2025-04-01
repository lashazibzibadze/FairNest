from fastapi import FastAPI
from app.database import engine
from app.routers import listings, users, favorites, contacts
from fastapi.middleware.cors import CORSMiddleware
from app import models

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
    "http://localhost:5173", 
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
app.include_router(users.router)
app.include_router(favorites.router)
app.include_router(contacts.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FairNest API!"}