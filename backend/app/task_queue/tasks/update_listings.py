import requests
from app.db_actions.geocords import get_addresses_to_update, update_address_with_geocords, delete_address
from app.database import SessionLocal
from app.config import key
from app.task_queue.celery_app import app
import json

@app.task(name="update_listings.tasks.update_existing_geocords")
def update_existing_geocords():
    print("Running task to update existing geocords")
    invalid = []
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
                invalid.append(address.id)
                delete_address(db, address.id)
                print(f"Status code {data["status"]}: Failed to get geocords for address {address.id}")
    return {"message": f"Task completed! Updated {len(address)} addresses.", "invalid_addresses": json.dumps(invalid)}

@app.task(name="update_listings.tasks.update_address")
def update_address(address_id, premise, street, locality, administrative_area):
    isValid = True
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
            isValid = False
            delete_address(db, address_id)
            print(f"Status code {data["status"]}: Failed to get geocords for listing {address_id}")
            
    return {"message": f"Task completed! Updated address {address_id}.", "isValid": isValid}

@app.task(name="update_listings.tasks.add")
def add(x, y):
    return x + y
