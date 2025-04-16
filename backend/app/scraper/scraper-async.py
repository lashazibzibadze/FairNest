from pathlib import Path
import json
from playwright.async_api import async_playwright
import asyncio
import random
from datetime import date, timedelta, datetime
from formatter import safe_int, safe_float, extract_address
import re
# import aioboto3
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import requests

import subprocess
import sys
import time
import signal
import math
from collections import Counter
from postgrest.exceptions import APIError


# Load environment variables
load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
CHROME_PATH = os.getenv("CHROME_PATH")
CHROME_PROFILE_NAME = os.getenv("CHROME_PROFILE_NAME")
CHROME_USER_DATA = os.getenv("CHROME_USER_DATA") # Make sure this is declared in env
if not CHROME_USER_DATA:
    raise ValueError("The CHROME_USER_DATA path is not defined in the .env file.")
if not CHROME_PATH:
    raise ValueError("CHROME_PATH is not set!")

# Supabase
#Initialize supabase connection
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
GOOGLE_GEOCODE_KEY = os.getenv('GEOCODE_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
semaphore = asyncio.Semaphore(32)
print("Supabase client initialized successfully!")


def format_data(raw_data):
    formatted_data = []

    for item in raw_data:
        try:
            # Convert price to integer
            price = safe_int(re.sub(r"[^\d]","", item["Price"]))
            
            # Extract address components
            premise, sub_premise, street_clean, city, state, postal_code = extract_address(item["Address"])
            
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
           
            # Create formatted dictionary
            formatted_item = {
                "price": price,
                "address": {
                    "country": "US",
                    "administrative_area": state,
                    "sub_administrative_area": item["Borough"],
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
            print(item)
            print(f"Error formatting data: {e}.")
            sys.exit(1)
    
    
    # Save formatted JSON
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dump_path = os.path.join(script_dir, "json-dump", "nyc_housing_data_test.json")
        
    with open(dump_path, "w") as file:
        json.dump(formatted_data, file, indent=4)
    
    print(f"Formatted JSON saved with {len(formatted_data)} entries!")
    return formatted_data


def extract_borough_name(url):
    last_segment = url.split("/")[-1]
    borough_raw = last_segment.split("_")[0]
    borough = borough_raw.replace("-", " ") 
    return borough


#Helper function to get geocode with google API
def get_geocode(address_data):
    address = f"{address_data['premise']} {address_data['street']}, {address_data['locality']}, {address_data['administrative_area']}"
    uri = f"https://maps.googleapis.com/maps/api/geocode/json?key={GOOGLE_GEOCODE_KEY}&address={address}"
    response = requests.get(uri)
    if response.status_code == 200:
        data = response.json()
        if data['results']:
            location = data['results'][0]['geometry']['location']
            return location['lat'], location['lng']
    return None, None


#Helper function to read dataset
def getData(filePath):
    with open(filePath, 'r') as f:
        data = json.load(f)
        return data














def insert_data(data, batch_size=50):
    address_rows = []
    property_rows = []

    for i, entry in enumerate(data):
        address_data = {
            'country': entry['address']['country'] or '',
            'administrative_area': entry['address']['administrative_area'] or '',
            'sub_administrative_area': entry['address']['sub_administrative_area'] or '',
            'locality': entry['address']['locality'] or '',
            'postal_code': entry['address']['postal_code'] or '',
            'street': entry['address']['street'] or '',
            'premise': entry['address']['premise'] or '',
            'sub_premise': entry['address']['sub_premise'] or '',
        }

        lat, lng = get_geocode(address_data)
        address_data['latitude'] = lat
        address_data['longitude'] = lng
        address_rows.append(address_data)

        price = entry['price'] or 0
        bedrooms = entry['bedrooms'] or 0
        bathrooms = entry['bathrooms'] or 0
        square_feet = entry['square_feet'] or 0
        acre_lot = entry['acre_lot'] or 0

        property_rows.append({
            'address_data': address_data,
            'property_data': {
                'price': price,
                'bedrooms': bedrooms,
                'bathrooms': bathrooms,
                'square_feet': square_feet,
                'sale_status': entry['sale_status'],
                'acre_lot': acre_lot,
                'tour_available': entry['tour_available'],
                'image_source': entry['image_source'],
            }
        })

        if len(address_rows) >= batch_size or i == len(data) - 1:
            try:
                # Deduplicate address rows based on on_conflict key
                unique_address_map = {}
                for addr in address_rows:
                    conflict_key = (
                        addr['country'], addr['administrative_area'], addr['sub_administrative_area'],
                        addr['locality'], addr['postal_code'], addr['street'], addr['premise'], addr['sub_premise']
                    )
                    if conflict_key not in unique_address_map:
                        unique_address_map[conflict_key] = addr

                deduped_address_rows = list(unique_address_map.values())

                # Log address duplicates if any
                keys = list(unique_address_map.keys())
                counter = Counter(keys)
                dupes = [k for k, v in counter.items() if v > 1]
                if dupes:
                    print("🟠 Duplicate address keys found in batch:")
                    for k in dupes:
                        print("→", k)

                try:
                    address_response = supabase.table('address').upsert(
                        deduped_address_rows,
                        on_conflict="country,administrative_area,sub_administrative_area,locality,postal_code,street,premise,sub_premise"
                    ).execute()
                except Exception as e:
                    print(f"🔥 Error inserting address batch: {e}")
                    sys.exit(1)
                    raise

                address_map = {
                    (
                        row['country'], row['administrative_area'], row['sub_administrative_area'], row['locality'],
                        row['postal_code'], row['street'], row['premise'], row['sub_premise']
                    ): row['id']
                    for row in address_response.data
                }

                seen_keys = set()
                property_payload = []
                for row in property_rows:
                    addr = row['address_data']
                    key = (
                        addr['country'], addr['administrative_area'], addr['sub_administrative_area'],
                        addr['locality'], addr['postal_code'], addr['street'], addr['premise'], addr['sub_premise']
                    )
                    address_id = address_map.get(key)
                    if not address_id:
                        print("❗ Address ID not found for:", key)
                        continue

                    listing = row['property_data']
                    listing['address_id'] = address_id

                    conflict_key = (
                        int(address_id),
                        round(float(listing['price']), 2),
                        listing['sale_status'].strip().lower()
                    )
                    if conflict_key not in seen_keys:
                        seen_keys.add(conflict_key)
                        property_payload.append(listing)

                try:
                    supabase.table('property_listings').upsert(
                        property_payload,
                        on_conflict="address_id,price,sale_status"
                    ).execute()
                    print(f"✅ Inserted {len(property_payload)} unique property listings.")

                except APIError as e:
                    err_info = e.args[0] if isinstance(e.args[0], dict) else {}
                    if err_info.get("code") == "21000":
                        print("⚠️ Batch failed. Falling back to row-by-row insert...")
                        successful, failed = 0, 0
                        failed_rows = []

                        for row in property_payload:
                            try:
                                supabase.table('property_listings').upsert(
                                    [row],
                                    on_conflict="address_id,price,sale_status"
                                ).execute()
                                successful += 1
                            except Exception as single_e:
                                print(f"🚫 Failed row insert: {row} → {single_e}")
                                failed_rows.append({**row, "_error": str(single_e)})
                                failed += 1

                        if failed_rows:
                            with open("failed_property_rows.json", "w") as f:
                                json.dump(failed_rows, f, indent=2)
                            print(f"📁 Logged {failed} failed rows to 'failed_property_rows.json'.")

                        print(f"🧾 Fallback complete: {successful} inserted, {failed} failed.")
                        sys.exit(1)
                    else:
                        sys.exit(1)
                        raise

            except Exception as e:
                print(f"🔥 Unhandled exception in batch: {e}")
                sys.exit(1)
                raise

            address_rows = []
            property_rows = []






async def scroll_until_bottom(page):
    """Scroll down the page until the bottom is reached."""
    last_height = await page.evaluate("document.body.scrollHeight")

    while True:
        # Scroll down by a fixed distance
        await page.evaluate("window.scrollBy(0, window.innerHeight);")
        
        await asyncio.sleep(3)  # Wait for content to load

        # Calculate new scroll height and compare with last height
        new_height = await page.evaluate("document.body.scrollHeight")

        if new_height == last_height:
            # If the new height is the same as the last height, we've reached the bottom
            print("reached bottom")
            break

        last_height = new_height  # Update the last height
        
async def scroll_until_element_in_view(page, element):
    """Scroll until specified element is in view."""
    try:
        if await element.count() > 0:
            await element.scroll_into_view_if_needed()
        else:
            print("Element not found.")
    except Exception as e:
        print(f"Error scrolling element into view: {e}")
        sys.exit(1)

async def scrape_listing_details(detail_page):
    try:
        # Get listing age
        listing_age = await detail_page.locator("div:has-text('On Realtor.com') + p").inner_text() if await detail_page.locator("div:has-text('On Realtor.com') + p").count() > 0 else "N/A"
        
        # Convert listing age to date format
        past_date = "N/A"
        
        if listing_age != "N/A":
            listing_age_number = ''.join(filter(str.isdigit, listing_age)) # keep only digits
            days_ago = int(listing_age_number)
            past_date = date.today() - timedelta(days=days_ago)
            listing_age = past_date.strftime("%Y-%m-%d")
        
        return listing_age
    
    except Exception as e:
        print(f"Error parsing listing page: {e}")
        sys.exit(1)
        return "N/A"


async def scrape_realtor(url, browser, start_page=1, end_page=1, timeout=300):
    USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ]

    random_user_agent = random.choice(USER_AGENTS)
    
    
    async with async_playwright() as p: 
        page = await browser.new_page()

        # await page.goto(f"{url}/type-single-family-home,condo,townhome,multi-family-home/pnd-hide/fc-hide/dom-1/pg-{start_page}", timeout=timeout * 1000)
        await page.goto(f"{url}/type-single-family-home,condo,townhome,multi-family-home/pnd-hide/fc-hide/pg-{start_page}", timeout=timeout * 1000)

        data = []
        current_page = start_page

        await scroll_until_bottom(page)
        
        total_pages = int(await page.locator(".page-container a.pagination-item").last.inner_text())

        while current_page <= end_page:
            print(f"Scraping page {current_page} where end page is {end_page}...")

            # Scroll down to load all listings
            await scroll_until_bottom(page)

            # Extract listings
            listings = await page.locator("[data-testid='property-list'] [data-testid='rdc-property-card']").all()

            print(f"Begin to extract {len(listings)} from page {current_page}")

            for listing in listings:
                try:  
                    price = await listing.locator("[data-testid='card-price']").inner_text() if await listing.locator("[data-testid='card-price']").count() > 0 else "N/A"
                    address = await listing.locator("[data-testid='card-address-1']").inner_text() if await listing.locator("[data-testid='card-address-1']").count() > 0 else "N/A"
                    if await listing.locator("[data-testid='card-address-2']").count() > 0:
                        address += ", " + await listing.locator("[data-testid='card-address-2']").inner_text()
                        
                    bedrooms = await listing.locator("[data-testid='property-meta-beds']").inner_text() if await listing.locator("[data-testid='property-meta-beds']").count() > 0 else "N/A"
                    bathrooms = await listing.locator("[data-testid='property-meta-baths']").inner_text() if await listing.locator("[data-testid='property-meta-baths']").count() > 0 else "N/A"
                    sqft = await listing.locator("[data-testid='property-meta-sqft']").locator("[data-testid='screen-reader-value']").inner_text() if await listing.locator("[data-testid='property-meta-sqft']").count() > 0 else "N/A"
                    acre_lot = await listing.locator("[data-testid='property-meta-lot-size']").locator("[data-testid='screen-reader-value']").inner_text() if await listing.locator("[data-testid='property-meta-lot-size']").count() > 0 else "N/A"
                    
                    sale_status = await listing.locator("[data-testid='card-description']").inner_text() if await listing.locator("[data-testid='card-description']").count() > 0 else "N/A"
                    tour_available = await listing.locator("[data-testid='bottom-overlay']").inner_text() if await listing.locator("[data-testid='bottom-overlay']").count() > 0 else "N/A"
                    
                    image_element = listing.locator("[data-testid='picture-img']").first
                    image_source = await image_element.get_attribute("src") if await image_element.count() > 0 else "N/A"
                    
                    realtor_link = await listing.locator("a").first.get_attribute("href") if await listing.locator("a").count() > 0 else "N/A"

                    # Make bedrooms and bathrooms in one line
                    bedrooms = ' '.join(bedrooms.splitlines()).strip()
                    bathrooms = ' '.join(bathrooms.splitlines()).strip()

                    data.append({
                        "Borough": extract_borough_name(url),
                        "Price": price,
                        "Address": address,
                        "Bedrooms": bedrooms,
                        "Bathrooms": bathrooms,
                        "Square Feet": sqft,
                        "Sale Status": sale_status,
                        "Acre Lot": acre_lot,
                        "Tour Available": tour_available,
                        "Image Source": image_source,
                        "Realtor Link": f"https://www.realtor.com{realtor_link}" if realtor_link != "N/A" else "N/A",
                    })
                    
                    print("Appended entry:", address)
                    
                    
                except Exception as e:
                    print(f"Error parsing listing: {e}")
                    sys.exit(1)

            # Check for the "Next" button if needed
            next_button = page.locator("[aria-label='Go to next page']").first
            if await next_button.is_visible():
                await next_button.click()
                await page.wait_for_load_state("load")
                current_page += 1
            else:
                break  # No more pages
            

        await page.close()
        return data, total_pages


# List of borough URLs
borough_urls = [
    # "https://www.realtor.com/realestateandhomes-search/Manhattan_NY",
    "https://www.realtor.com/realestateandhomes-search/Bronx_NY",
    # "https://www.realtor.com/realestateandhomes-search/Brooklyn_NY",
    # "https://www.realtor.com/realestateandhomes-search/Queens_NY",
    # "https://www.realtor.com/realestateandhomes-search/Staten-Island_NY"
    
    # "https://www.realtor.com/realestateandhomes-search/79936" # texas
    # "https://www.realtor.com/realestateandhomes-search/60629" # chicago
    # "https://www.realtor.com/realestateandhomes-search/90011" # DEMO la
]

# Scrape data asynchronously
async def main():    
    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(CHROME_USER_DATA, channel="chrome", headless=False, viewport={"width":1080,"height":4320})
        combined_data = []
    
        # QUICK CONFIGURABLES
        # pages_per_task = 1
        
        for borough_url in borough_urls:
            print(f"Scraping data for: {borough_url}")
            
            # Scrape the first page to get the total number of pages
            initial_data, total_pages = await scrape_realtor(borough_url, browser=browser, start_page=1, end_page=1)
        
            pages_per_task =  math.ceil(total_pages / 8)
        
            tasks = []
            for start_page in range(1, total_pages + 1, pages_per_task):
                end_page = min(start_page + pages_per_task - 1, total_pages)
                task = asyncio.create_task(scrape_realtor(borough_url, browser=browser, start_page=start_page, end_page=end_page))
                tasks.append(task)
        
            # Gather results from all tasks
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Merged scraped data into combined list
            for index, result in enumerate(results):
                if isinstance(result, tuple) and len(result) == 2:
                    data, _ = result
                    combined_data.extend(data)
                else:
                    print(f"Error during scraping task for {borough_url}: {result}")
            
        await browser.close()
            
        formatted_data = format_data(combined_data)
        
        insert_data(formatted_data)
     


def refresh_cookies():
    # The profile name or directory you want to use
    profile_name = CHROME_PROFILE_NAME # Go to chrome://version on your Chrome browser and take a look at profile path for the name (e.g. Profile 1, Profile 2, etc.)

    # URL to open
    url = "https://realtor.com"
    
    time.sleep(4)

    # Launch Chrome
    process = subprocess.Popen([
        CHROME_PATH,
        f'--profile-directory={profile_name}',
        url
    ])
    time.sleep(4)
    if sys.platform == "win32":
        process.terminate()
    else:
        os.kill(process.pid, signal.SIGTERM)

refresh_cookies()


# Run the main function
asyncio.run(main())


# open_dir = Path("backend") / "app" / "scraper" / "json-dump"
# open_path = open_dir / "nyc_housing_data_test.json"
        
# with open(open_path, "r") as file:
#     data = json.load(file)
    
    
# insert_data(data)