import os
from dotenv import load_dotenv

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