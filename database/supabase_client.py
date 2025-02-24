from dotenv import load_dotenv
from supabase import create_client, Client
import os

#load environment variables
load_dotenv()

#setting up the connection to the supabase client
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

data = {"address": "123 hunter college",
        "city": "Manhattan",
        "state": "NY",
        "zip": "11111"
        }
#test connection
test = (
    supabase.table("listings")
    .insert(data)
    .execute()
)

print(test)