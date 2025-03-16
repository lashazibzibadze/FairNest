import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        # Launch Chrome in Guest Mode using a temporary profile
        browser = await p.chromium.launch(headless=False, args=[
            "--guest",  # This flag is not officially documented, but it simulates guest mode
            "--disable-infobars",  # Disable info bars
            "--disable-extensions",  # Disable extensions
            "--disable-popup-blocking"  # Allow pop-ups
        ])
        
        page = await browser.new_page()

        # Navigate to Realtor.com
        await page.goto("https://www.realtor.com")

        # Print the page title
        title = await page.title()
        print(await page.content())

        # Close the browser
        await browser.close()

# Run the async function
asyncio.run(run())
