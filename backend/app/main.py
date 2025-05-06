from fastapi import FastAPI, Security
from app.database import engine
from app.routers import listings, users, favorites, contacts
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from app import models
from .utils import VerifyToken
from os import getenv

app = FastAPI(
    title="FairNest API",
    summary="API for FairNest, where everyone has a fair chance to find their dream home.",
    version="0.0.1"
)
auth = VerifyToken()

models.Base.metadata.create_all(bind=engine)

frontend_url = getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(listings.router)
app.include_router(users.router)
app.include_router(favorites.router)
app.include_router(contacts.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FairNest API!"}

# @app.get("/api/public")
# def public():
#     """No access token required to access this route"""

#     result = {
#         "status": "success",
#         "msg": ("Hello from a public endpoint! You don't need to be "
#                 "authenticated to see this.")
#     }
#     return result

# @app.get("/api/private")
# def private(auth_result: str = Security(auth.verify)):
#     """A valid access token is required to access this route"""

#     return auth_result