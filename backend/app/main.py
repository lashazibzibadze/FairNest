from fastapi import FastAPI
from database import engine
from routers import listings
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

models.Base.metadata.create_all(bind=engine)

app.include_router(listings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FairNest API!"}