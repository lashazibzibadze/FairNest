# from playwright.sync_api import sync_playwright
# import pandas as pd
# import random
# import json

# """ Info for each listing search result
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




################# Info for each individual page ##########################
# Information         Property "data-test-id"'s value
# Agent and Broker    ldp-agent-overview
# Images              responsive-image
# Address             address-line-ldp
# Beds                property-meta-beds
# Baths               property-meta-baths
# Square Feet         property-meta-sqft
# Lot Size            property-meta-lot-size
# Price               ldp-list-price
# Sale Status         status-indicator

# Back button: aria-label="back to search results"
# Listing item link: rdc-property-card's first anchor tag


# * = May not be there
# Property is useful only if all non-* information is present
# """



from pathlib import Path
import json
from playwright.sync_api import sync_playwright
import time
import random
from datetime import date, timedelta

def scroll_until_bottom(page):
    """Scroll down the page until the bottom is reached."""
    last_height = page.evaluate("document.body.scrollHeight")
    
    while True:
        # Scroll down by a fixed distance
        page.evaluate("window.scrollBy(0, window.innerHeight);")
        time.sleep(random.uniform(1, 2))  # Wait for content to load
        
        # Calculate new scroll height and compare with last height
        new_height = page.evaluate("document.body.scrollHeight")
        
        if new_height == last_height:
            # If the new height is the same as the last height, we've reached the bottom
            break
        
        last_height = new_height  # Update the last height


# For now we only need to scrape listing posted date
def scrape_listing_details(page, listing_link):
    listing_link.click()
    page.wait_for_load_state("load")
    
    time.sleep(random.uniform(1,2))
    
    
    try:
        # Extract additional details from the listing page
        
        
        
        
        # agent_info = page.locator("[data-testid='ldp-agent-overview']").inner_text() if page.locator("[data-testid='ldp-agent-overview']").count() > 0 else "N/A"
        # images = [img.get_attribute("src") for img in page.locator("[data-testid='responsive-image']").all()]

        # Get other data fields (beds, baths, price, etc.)
        # address = page.locator("[data-testid='address-line-ldp']").inner_text() if page.locator("[data-testid='address-line-ldp']").count() > 0 else "N/A"
        # price = page.locator("[data-testid='ldp-list-price']").inner_text() if page.locator("[data-testid='ldp-list-price']").count() > 0 else "N/A"
        # bedrooms = page.locator("[data-testid='property-meta-beds']").inner_text() if page.locator("[data-testid='property-meta-beds']").count() > 0 else "N/A"
        # bathrooms = page.locator("[data-testid='property-meta-baths']").inner_text() if page.locator("[data-testid='property-meta-baths']").count() > 0 else "N/A"
        # sqft = page.locator("[data-testid='property-meta-sqft']").inner_text() if page.locator("[data-testid='property-meta-sqft']").count() > 0 else "N/A"
        # lot_size = page.locator("[data-testid='property-meta-lot-size']").inner_text() if page.locator("[data-testid='property-meta-lot-size']").count() > 0 else "N/A"
        # sale_status = page.locator("[data-testid='status-indicator']").inner_text() if page.locator("[data-testid='status-indicator']").count() > 0 else "N/A"
        

        # return {
        #     "URL": url,
        #     "Address": address,
        #     "Price": price,
        #     "Bedrooms": bedrooms,
        #     "Bathrooms": bathrooms,
        #     "Square Feet": sqft,
        #     "Lot Size": lot_size,
        #     "Sale Status": sale_status,
        #     "Agent Info": agent_info,
        #     "Images": images
        # }
        
        # Geting listing age
        listing_age = page.locator("div:has-text('On Realtor.com') + p").inner_text() if page.locator("div:has-text('On Realtor.com') + p").count() > 0 else "N/A"
        
        # Convert listing age to date format
        past_date = "N/A"
        
        if listing_age != "N/A":
            days_ago = int(listing_age)
            past_date = date.today() - timedelta(days=days_ago)
            listing_age = past_date.strftime("%Y-%m-%d")
        
        return listing_age
    
    except Exception as e:
        print(f"Error parsing listing page {url}: {e}")
        return "N/A"



def scrape_realtor(url, max_pages=5, timeout=60, start_page = 1, end_page = -1, output_file_name="output"):
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        page.goto(url, timeout=timeout * 1000)

        data = []
        current_page = 1

        while current_page <= max_pages:
            print(f"Scraping page {current_page}...")

            # Scroll down to load all listings
            scroll_until_bottom(page)

            # Extract listings
            listings = page.locator("[data-testid='rdc-property-card']").all()

            for listing in listings:
                try:
                    price = listing.locator("[data-testid='card-price']").inner_text() if listing.locator("[data-testid='card-price']").count() > 0 else "N/A"
                    address = listing.locator("[data-testid='card-address-1']").inner_text() if listing.locator("[data-testid='card-address-1']").count() > 0 else "N/A"
                    if listing.locator("[data-testid='card-address-2']").count() > 0:
                        address += ", " + listing.locator("[data-testid='card-address-2']").inner_text()
                        
                    bedrooms = listing.locator("[data-testid='property-meta-beds']").inner_text() if listing.locator("[data-testid='property-meta-beds']").count() > 0 else "N/A"
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


                    # link_element = listing.locator("[data-testid='card-content'] a").first
                    # date_posted = scrape_listing_details(page, link_element)
                    
                    # Go back to search results page
                    # back_link = page.locator("[aria-label='back to search results']").first
                    # back_link.click()
                    # page.wait_for_load_state("load")

                    data.append({
                        "Price": price,
                        "Address": address,
                        "Bedrooms": bedrooms,
                        "Bathrooms": bathrooms,
                        "Square Feet": sqft,
                        "Sale Status": sale_status,
                        "Acre Lot": acre_lot,
                        "Tour Available": tour_available,
                        "Image Source": image_source,
                        # "Date Posted": date_posted,
                    })
                    
                    time.sleep(random.uniform(1,2))
                    
                except Exception as e:
                    print(f"Error parsing listing: {e}")

            # Check for the "Next" button if needed
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
        dump_path = dump_dir / f"{output_file_name}.json"
        dump_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(dump_path, 'w') as json_file:
            json.dump(data, json_file, indent=4)
        
        print("JSON successfully dumped with " + str(len(data)) + " entries!")
        
        return data


# URL to scrape
url = "https://www.realtor.com/realestateandhomes-search/Manhattan_NY"

# Scrape data
scrape_realtor(url, start_page=1, end_page=50, output_file_name="manhattan1-50")
scrape_realtor(url, start_page=51, end_page=98, output_file_name="manhattan51-end")