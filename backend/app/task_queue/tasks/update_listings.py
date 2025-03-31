import requests
from app.db_actions.geocords import get_addresses_to_update, update_address_with_geocords
from app.database import SessionLocal
from app.config import key
from app.task_queue.celery_app import app

@app.task(name="update_listings.tasks.update_existing_geocords")
def update_existing_geocords():
    print("Running task to update existing geocords")
    
    with SessionLocal() as db:
        addresses = get_addresses_to_update(db)

        for address in addresses:
            print(f"Updating address {address.id}")
            query_string = f"key={key}&address={address.premise}{address.street},{address.locality},{address.administrative_area}"
            response = requests.get(
                f"https://maps.googleapis.com/maps/api/geocode/json?{query_string}"
            )
            data = response.json()

            if data["status"] == "OK":
                lat, lng = data["results"][0]["geometry"]["location"].values()
                print(f"Geocords: {lat}, {lng}")
                update_address_with_geocords(db, address.id, lat, lng)
            else:
                print(f"Status code {data["status"]}: Failed to get geocords for listing {address.id}")

    return {"message": f"Task completed! Updated {len(address)} addresses."}

@app.task(name="update_listings.tasks.update_address")
def update_address(address_id, premise, street, locality, administrative_area):
    with SessionLocal() as db:
        print(f"Updating address {address_id}")
        query_string = f"key={key}&address={premise}{street},{locality},{administrative_area}"
        response = requests.get(
            f"https://maps.googleapis.com/maps/api/geocode/json?{query_string}"
        )
        
        data = response.json()

        if data["status"] == "OK":
            lat, lng = data["results"][0]["geometry"]["location"].values()
            print(f"Geocords: {lat}, {lng}")
            update_address_with_geocords(db, address_id, lat, lng)
        else:
            print(f"Status code {data["status"]}: Failed to get geocords for listing {address_id}")
            
    return {"message": f"Task completed! Updated address {address_id}."}

@app.task(name="update_listings.tasks.add")
def add(x, y):
    return x + y
