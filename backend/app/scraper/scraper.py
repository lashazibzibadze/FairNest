from playwright.sync_api import sync_playwright

def test_get(url, timeout_in_seconds):
    print("======= SCRAPE START ========")
    pw = sync_playwright().start()
    browser = pw.firefox.launch(headless=False)
    page = browser.new_page()
    page.goto(url, timeout = 1000 * timeout_in_seconds)

    listings = page.locator("[data-testid='rdc-property-card']").all()
    for listing in listings:
        print(listing.inner_text())
        print("======================") # Separation for better visibility
    browser.close()
    print("======= SCRAPE END ========")

def main():
    data = test_get("https://www.realtor.com/realestateandhomes-search/13337", 60)
    # test_get("http://example.com")

if __name__ == '__main__':
    main()

