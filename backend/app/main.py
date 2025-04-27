from fastapi import FastAPI, Security
from app.database import engine
from app.routers import listings, users, favorites, contacts
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from app import models
from .utils import VerifyToken

app = FastAPI(
    title="FairNest API",
    summary="API for FairNest, where everyone has a fair chance to find their dream home.",
    version="0.0.1"
)
auth = VerifyToken()

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