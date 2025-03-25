
# async def scroll_until_bottom(page):
#     """Scroll down the page until the bottom is reached."""
#     last_height = await page.evaluate("document.body.scrollHeight")

#     while True:
#         # Scroll down by a fixed distance
#         await page.evaluate("window.scrollBy(0, window.innerHeight);")
#         await asyncio.sleep(random.uniform(1, 2))  # Wait for content to load

#         # Calculate new scroll height and compare with last height
#         new_height = await page.evaluate("document.body.scrollHeight")

#         if new_height == last_height:
#             # If the new height is the same as the last height, we've reached the bottom
#             break

#         last_height = new_height  # Update the last height
        
        
# async def scroll_until_element_in_view(page, listing):
#     """Scroll until specified element is in view."""
#     element = page.locator(listing)
#     if await element.count() > 0:
#         await element.scroll_into_view_if_needed()
#     else:
#         print("Element not found.")





# async def scrape_listing_details(detail_page):
#     try:
#         # Get listing age
#         listing_age = await detail_page.locator("div:has-text('On Realtor.com') + p").inner_text() if await detail_page.locator("div:has-text('On Realtor.com') + p").count() > 0 else "N/A"
        
#         # Convert listing age to date format
#         past_date = "N/A"
        
#         if listing_age != "N/A":
#             days_ago = int(listing_age)
#             past_date = date.today() - timedelta(days=days_ago)
#             listing_age = past_date.strftime("%Y-%m-%d")
        
#         return listing_age
    
#     except Exception as e:
#         print(f"Error parsing listing page: {e}")
#         return "N/A"


# async def scrape_realtor(url, max_pages=5, timeout=60):
#     async with async_playwright() as p:
#         browser = await p.firefox.launch(headless=False)
#         context = await browser.new_context()
#         page = await context.new_page()
#         await page.goto(url, timeout=timeout * 1000)

#         data = []
#         current_page = 1

#         while current_page <= max_pages:
#             print(f"Scraping page {current_page}...")

#             # Scroll down to load all listings
#             # await scroll_until_bottom(page)

#             # Extract listings
#             listings = await page.locator("[data-testid='rdc-property-card']").all()

#             for listing in listings:
#                 try:
#                     # Scroll until current listing is in view
#                     await scroll_until_element_in_view(page, listing)
                    
#                     price = await listing.locator("[data-testid='card-price']").inner_text() if await listing.locator("[data-testid='card-price']").count() > 0 else "N/A"
#                     address = await listing.locator("[data-testid='card-address-1']").inner_text() if await listing.locator("[data-testid='card-address-1']").count() > 0 else "N/A"
#                     if await listing.locator("[data-testid='card-address-2']").count() > 0:
#                         address += ", " + await listing.locator("[data-testid='card-address-2']").inner_text()
                        
#                     bedrooms = await listing.locator("[data-testid='property-meta-beds']").inner_text() if await listing.locator("[data-testid='property-meta-beds']").count() > 0 else "N/A"
#                     bathrooms = await listing.locator("[data-testid='property-meta-baths']").inner_text() if await listing.locator("[data-testid='property-meta-baths']").count() > 0 else "N/A"
#                     sqft = await listing.locator("[data-testid='property-meta-sqft']").locator("[data-testid='screen-reader-value']").inner_text() if await listing.locator("[data-testid='property-meta-sqft']").count() > 0 else "N/A"
#                     acre_lot = await listing.locator("[data-testid='property-meta-lot-size']").locator("[data-testid='screen-reader-value']").inner_text() if await listing.locator("[data-testid='property-meta-lot-size']").count() > 0 else "N/A"
                    
#                     sale_status = await listing.locator("[data-testid='card-description']").inner_text() if await listing.locator("[data-testid='card-description']").count() > 0 else "N/A"
#                     tour_available = await listing.locator("[data-testid='bottom-overlay']").inner_text() if await listing.locator("[data-testid='bottom-overlay']").count() > 0 else "N/A"
                    
#                     image_element = listing.locator("[data-testid='picture-img']").first
#                     image_source = await image_element.get_attribute("src") if await image_element.count() > 0 else "N/A"

#                     # Make bedrooms and bathrooms in one line
#                     bedrooms = ' '.join(bedrooms.splitlines()).strip()
#                     bathrooms = ' '.join(bathrooms.splitlines()).strip()


#                     # Go to individual listing page
#                     await asyncio.sleep(random.uniform(3,4))
#                     link_element = listing.locator("[data-testid='card-content'] a").first
#                     detail_url = await link_element.get_attribute("href")
                    
#                     if detail_url:
#                         detail_page = await context.new_page()
#                         await detail_page.goto(detail_url)
#                         date_posted = await scrape_listing_details(detail_page)
#                         await detail_page.close()
                        
#                     await asyncio.sleep(random.uniform(3,4))

#                     data.append({
#                         "Price": price,
#                         "Address": address,
#                         "Bedrooms": bedrooms,
#                         "Bathrooms": bathrooms,
#                         "Square Feet": sqft,
#                         "Sale Status": sale_status,
#                         "Acre Lot": acre_lot,
#                         "Tour Available": tour_available,
#                         "Image Source": image_source,
#                         "Date Posted": date_posted,
#                     })
                    
                    
#                 except Exception as e:
#                     print(f"Error parsing listing: {e}")

#             # Check for the "Next" button if needed
#             next_button = page.locator("[aria-label='Go to next page']").first
#             if await next_button.is_visible():
#                 await next_button.click()
#                 await page.wait_for_load_state("load")
#                 current_page += 1
#             else:
#                 break  # No more pages
            

#         await browser.close()
        
#         # Dump JSON
#         dump_dir = Path("backend") / "app" / "scraper" / "json-dump"
#         dump_path = dump_dir / "real_estate_listings.json"
#         dump_path.parent.mkdir(parents=True, exist_ok=True)
        
#         with open(dump_path, 'w') as json_file:
#             json.dump(data, json_file, indent=4)
        
#         print("JSON successfully dumped with " + str(len(data)) + " entries!")
        
#         return data