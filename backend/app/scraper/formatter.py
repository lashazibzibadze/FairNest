import re
from pathlib import Path
import json
from datetime import datetime

def extract_premise_and_sub_premise(address):
    """
    Extracts premise (house/street number) and sub_premise (apt/floor/unit) from the street address.
    """
    # Pattern to match house/street numbers (e.g., "123", "764", "303")
    premise_match = re.match(r"^(\d+)", address.strip())

    # Pattern to find sub-premise keywords like Apt, Unit, Floor (e.g., "Apt 3B", "Unit 127/128", "Floor 5")
    sub_premise_match = re.search(r"(?:Apt|Unit|Floor|Suite|#)\s*([\w\d/-]+)", address, re.IGNORECASE)

    premise = premise_match.group(1) if premise_match else None
    sub_premise = sub_premise_match.group(1) if sub_premise_match else None

    # Remove premise and sub_premise from the street name
    street_clean = address
    if premise:
        street_clean = re.sub(r"^\d+\s*", "", street_clean)  # Remove leading number
    if sub_premise:
        street_clean = re.sub(r"(?:Apt|Unit|Floor|Suite|#)\s*[\w\d/-]+", "", street_clean, flags=re.IGNORECASE)

    return premise, sub_premise, street_clean.strip()


def safe_int(value):
    # Convert cleaned numeric string to int, returning None if invalid
    if value and value.isdigit():
        return int(value)
    return None

def safe_float(value):
    # Convert cleaned numeric string to float, returning None if invalid
    try:
        return float(value) if value else None
    except ValueError:
        return None


def format_realtor_data(input_path, output_path):
    # Load raw scraped data
    with open(input_path, "r") as file:
        raw_data = json.load(file)
    
    
    formatted_data = []
    
    for item in raw_data:
        try:
            # Convert price to integer
            price = safe_int(re.sub(r"[^\d]","", item["Price"]))
            
            # Extract address components
            address_parts = item["Address"].split(", ")
            street = address_parts[0] if len(address_parts) > 0 else None
            city = address_parts[1] if len(address_parts) > 1 else None
            state_zip = address_parts[2] if len(address_parts) > 2 else None
            
            # Extract state and postal code
            if state_zip and " " in state_zip:
                state, postal_code = state_zip.split()[:2]
            else:
                state, postal_code = state_zip, None
                
            
            # Bedrooms and bathroooms
            bedrooms = safe_int(re.sub(r"[^\d]", "", item.get("Bedrooms", "")))
            bathrooms = safe_float(re.sub(r"[^\d.]", "", item.get("Bathrooms", "")))
            if bathrooms is not None:
                bathrooms = round(bathrooms, 1)
            
            # Square feet and acre lot
            square_feet = safe_float(re.sub(r"[^\d]", "", item.get("Square Feet", "")))
            acre_lot = safe_float(re.sub(r"[^\d.]", "", item.get("Acre Lot", "")))
            
            # Convert tour availability to boolean
            tour_available = item.get("Tour Available", "N/A") != "N/A"
            
            # Premise and subpremise
            premise, sub_premise, street_clean = extract_premise_and_sub_premise(street)
            
            
            # Create formatted dictionary
            formatted_item = {
                "price": price,
                "address": {
                    "country": "US",
                    "administrative_area": state,
                    "sub_administrative_area": None,
                    "locality": city,
                    "postal_code": postal_code,
                    "street": street_clean,
                    "premise": premise,
                    "sub_premise": sub_premise,
                },
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "square_feet": square_feet,
                "sale_status": item["Sale Status"],
                "acre_lot": acre_lot,
                "tour_available": tour_available,
                "image_source": item["Image Source"],
                "realtor_link": item["Realtor Link"]
            }
            
            formatted_data.append(formatted_item)
        except Exception as e:
            print(f"Error formatting data: {e}")
            
    # Save formatted JSON
    with open(output_path, "w") as file:
        json.dump(formatted_data, file, indent=4)
    
    print(f"Formatted JSON saved with {len(formatted_data)} entries!")
    return formatted_data



# output_file_name = "manhattan"
# now = datetime.now()
# formatted_time = now.strftime("%Y-%m-%d")
# dump_dir = Path("backend") / "app" / "scraper" / "json-dump"
# dump_path = dump_dir / f"{output_file_name}-{formatted_time}.json"
# formatted_dump_path = dump_dir / f"{output_file_name}-{formatted_time}-formatted.json"

# format_realtor_data(dump_path, formatted_dump_path)