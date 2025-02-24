from playwright.sync_api import sync_playwright


"""
Information         Property "data-test-id"'s value

Sale status         card-description
Listing price       card-price
Address line 1      card-address-1
Address line 2      card-address-2
Bedrooms            property-meta-beds
Bathrooms           property-meta-baths
Square feet*        property-meta-sqft
Acre lot            screen-reader-value
Tour available*     bottom-overlay
Discount amount*    card-reduced-amount
New*                 label-new

* = May not be there
Property is useful only if all non-* information is present
"""

def test_get(url, timeout_in_seconds):
    print("======= SCRAPE START ========")
    pw = sync_playwright().start()
    browser = pw.firefox.launch(headless=False)
    page = browser.new_page()
    page.goto(url, timeout = 1000 * timeout_in_seconds)

    listings = page.locator("[data-testid='rdc-property-card']").all()
    for listing in listings:
        # print(listing.inner_html())
        print(listing.inner_text())
        print("======================") # Separation for better visibility
    browser.close()
    print("======= SCRAPE END ========")

def main():
    data = test_get("https://www.realtor.com/realestateandhomes-search/13337", 60)
    # test_get("http://example.com")

if __name__ == '__main__':
    main()

