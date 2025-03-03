# from playwright.sync_api import sync_playwright
# import pandas as pd
# import random
# import json

# """
# Information         Property "data-test-id"'s value

# Sale status         card-description
# Listing price       card-price
# Address line 1      card-address-1
# Address line 2      card-address-2
# Bedrooms            property-meta-beds 
# Bathrooms           property-meta-baths
# Square feet*        property-meta-sqft screen-reader-value
# Acre lot            property-meta-lot-size screen-reader-value
# Tour available*     bottom-overlay
# Discount amount*    card-reduced-amount
# New*                label-new
# Image               picture-img

# * = May not be there
# Property is useful only if all non-* information is present
# """

from pathlib import Path
import json
from playwright.sync_api import sync_playwright

def scrape_realtor(url, max_pages=5, timeout=60):
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        page.goto(url, timeout=timeout * 1000)

        data = []
        current_page = 1

        while current_page <= max_pages:
            print(f"Scraping page {current_page}...")

            listings = page.locator("[data-testid='rdc-property-card']").all()

            for listing in listings:
                try:
                    price = listing.locator("[data-testid='card-price']").inner_text() if listing.locator("[data-testid='card-price']").count() > 0 else "N/A"
                    address = listing.locator("[data-testid='card-address-1']").inner_text() if listing.locator("[data-testid='card-address-1']").count() > 0 else "N/A"
                    if listing.locator("[data-testid='card-address-2']").count() > 0:
                        address += ", " + listing.locator("[data-testid='card-address-2']").inner_text()
                        
                    bedrooms = listing.locator("[data-testid='property-meta-beds']").inner_text()  if listing.locator("[data-testid='property-meta-beds']").count() > 0 else "N/A"
                    bathrooms = listing.locator("[data-testid='property-meta-baths']").inner_text() if listing.locator("[data-testid='property-meta-baths']").count() > 0 else "N/A"
                    sqft = listing.locator("[data-testid='property-meta-sqft']").locator("[data-testid='screen-reader-value']").inner_text() if listing.locator("[data-testid='property-meta-sqft']").count() > 0 else "N/A"
                    acre_lot = listing.locator("[data-testid='property-meta-lot-size']").locator("[data-testid='screen-reader-value']").inner_text() if listing.locator("[data-testid='property-meta-lot-size']").count() > 0 else "N/A"
                    
                    sale_status = listing.locator("[data-testid='card-description']").inner_text() if listing.locator("[data-testid='card-description']").count() > 0 else "N/A"
                    tour_available = listing.locator("[data-testid='bottom-overlay']").inner_text() if listing.locator("[data-testid='bottom-overlay']").count() > 0 else "N/A"
                    
                    image_element = listing.locator("[data-testid='picture-img']").first
                    image_source = image_element.get_attribute("src") if image_element.count() > 0 else "N/A"

                    # Make bedrooms and bathrooms in one line
                    bedrooms = ' '.join(bedrooms.splitlines()).strip()
                    bathrooms = ' '.join(bathrooms.splitlines()).strip()

                    data.append({
                        "Price": price,
                        "Address": address,
                        "Bedrooms": bedrooms,
                        "Bathrooms": bathrooms,
                        "Square Feet": sqft,
                        "Sale Status": sale_status,
                        "Acre Lot": acre_lot,
                        "Tour Available": tour_available,
                        "Image Source": image_source
                    })
                    
                except Exception as e:
                    print(f"Error parsing listing: {e}")

            # Find and click the "Next" button
            next_button = page.locator("[aria-label='Go to next page']").first
            if next_button.is_visible():
                next_button.click()
                page.wait_for_load_state("load")
                current_page += 1
            else:
                break  # No more pages

        browser.close()
        
        # Dump JSON
        dump_dir = Path("backend") / "app" / "scraper" / "json-dump"
        dump_path = dump_dir / "real_estate_listings.json"
        dump_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(dump_path, 'w') as json_file:
            json.dump(data, json_file, indent=4)
        
        print("JSON successfully dumped with " + str(len(data)) +" entries!")
        
        return data

# URL to scrape
url = "https://www.realtor.com/realestateandhomes-search/13337"
# url = "https://www.realtor.com/realestateandhomes-search/Manhattan_NY"

# Scrape data
scraped_data = scrape_realtor(url)