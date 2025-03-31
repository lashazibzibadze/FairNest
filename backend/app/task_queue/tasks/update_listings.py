import requests
from app.db_actions.geocords import get_listings_to_update, update_listing_with_geocords
from app.database import SessionLocal
from app.config import key
from app.task_queue.celery_app import app

@app.task(name="update_listings.tasks.update_existing_geocords")
def update_existing_geocords():
    print("Running task to update existing geocords")
    
    with SessionLocal() as db:
        listings = get_listings_to_update(db)

        for listing in listings:
            print(f"Updating listing {listing.id}")
            response = requests.get(
                f"https://maps.googleapis.com/maps/api/geocode/json?key={key}address={listing.premise}{listing.street},{listing.locality},{listing.administrative_area}"
            )
            data = response.json()

            if data["status"] == "OK":
                lat, lng = data["results"][0]["geometry"]["location"].values()
                print(f"Geocords: {lat}, {lng}")
                update_listing_with_geocords(db, listing.id, lat, lng)
            else:
                print(f"Status code {data["status"]}: Failed to get geocords for listing {listing.id}")

    return {"message": f"Task completed! Updated {len(listings)} listings."}


@app.task(name="update_listings.tasks.add")
def add(x, y):
    return x + y
