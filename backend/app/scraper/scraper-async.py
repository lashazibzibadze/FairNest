from pathlib import Path
import json
from playwright.async_api import async_playwright
import asyncio
import random
from datetime import date, timedelta
from playwright_stealth import stealth_async

async def scroll_until_bottom(page):
    """Scroll down the page until the bottom is reached."""
    last_height = await page.evaluate("document.body.scrollHeight")

    while True:
        # Scroll down by a fixed distance
        await page.evaluate("window.scrollBy(0, window.innerHeight);")
        
        # Scroll to last element
        # listings = await page.locator("[data-testid='rdc-property-card']").all()
        # if listings:
        #     await listings[-1].scroll_into_view_if_needed()
        
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
        return "N/A"



async def scrape_realtor(url, start_page=1, end_page=-1, timeout=60, output_file_name="output"):
    async with async_playwright() as p:
        browser = await p.firefox.launch(headless=False)
        context = await browser.new_context(
            viewport={"width":1080, "height":4320},
            ignore_https_errors=True,
            bypass_csp=True,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            accept_downloads=True,
            java_script_enabled=True
        )
        # Block all CSS
        await context.route("**/*.{woff,woff2,gif}", lambda route: route.abort())
        
        
        
        page = await context.new_page()
        
        
        await page.set_extra_http_headers({ "Accept-Language": "en-US,en;q=0.9","Referer": "https://www.google.com/", "DNT": "1", })
        
        # await stealth_async(page)
        
        await page.goto(f"{url}/type-single-family-home,condo,townhome,multi-family-home/pnd-hide/fc-hide/pg-{start_page}", timeout=timeout * 1000)
        # await page.goto(f"{url}/pg-{start_page}", timeout=timeout * 1000)
        # await page.goto(f"{url}", timeout=timeout * 1000)

        data = []
        current_page = start_page

        await scroll_until_bottom(page)


        if end_page == -1:
            end_page = int(await page.locator(".page-container a.pagination-item").last.inner_text())    
        

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

                    # Make bedrooms and bathrooms in one line
                    bedrooms = ' '.join(bedrooms.splitlines()).strip()
                    bathrooms = ' '.join(bathrooms.splitlines()).strip()


                    # Go to individual listing page
                    # await asyncio.sleep(random.uniform(2,3))
                    # link_element = listing.locator("[data-testid='card-content'] a").first
                    
                    
                    # if await link_element.count() > 0:
                    #     await link_element.click()
                    #     await page.wait_for_selector("div:has-text('On Realtor.com') + p")
                    #     date_posted = await scrape_listing_details(page)
                    #     await page.go_back()
                    #     await scroll_until_bottom(page)
                    #     asyncio.sleep(random.uniform(3,4))
                    

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
                    
                    print("Appended entry:", address)
                    
                    
                except Exception as e:
                    print(f"Error parsing listing: {e}")

            # Check for the "Next" button if needed
            next_button = page.locator("[aria-label='Go to next page']").first
            if await next_button.is_visible():
                await next_button.click()
                await page.wait_for_load_state("load")
                current_page += 1
            else:
                break  # No more pages
            

        await browser.close()
        
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

# Scrape data asynchronously
async def main():
    # task1 = asyncio.create_task(scrape_realtor(url, start_page=1, end_page=50, output_file_name="manhattan1-50"))
    # task2 = asyncio.create_task(scrape_realtor(url, start_page=51, end_page=98, output_file_name="manhattan51-end"))

    # await asyncio.gather(task1, task2, return_exceptions=True)
    await scrape_realtor(url, start_page=1, end_page=50, output_file_name="manhattan1-50")
    await asyncio.sleep(30)
    await scrape_realtor(url, start_page=51, end_page=98, output_file_name="manhattan51-end")
    

# Run the main function
asyncio.run(main())
