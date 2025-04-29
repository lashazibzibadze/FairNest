import os
from dotenv import load_dotenv
from functools import lru_cache

from pydantic_settings import BaseSettings

load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
DATABASE_URL: str = os.getenv("DATABASE_URL")

username = os.getenv("user")
password = os.getenv("password")
dbname = os.getenv("dbname")
port = os.getenv("port")
host = os.getenv("host")
key = os.getenv("key")

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE")
AUTH0_ISSUER = os.getenv("AUTH0_ISSUER")
AUTH0_ALGORITHMS = os.getenv("AUTH0_ALGORITHMS")


class Settings(BaseSettings):
    supabase_url: str
    database_url: str
    supabase_key: str
    user: str
    password: str
    host: str
    port: int
    dbname: str
    key: str
    google: str
    
    auth0_domain: str
    auth0_api_audience: str
    auth0_issuer: str
    auth0_algorithms: str

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()