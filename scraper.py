import asyncio
import os
from playwright.async_api import async_playwright

# File path for storing links
LINKS_FILE = "lawyer_links.txt"

async def extract_lawyer_ids(page):
    """Extracts lawyer IDs from the directory page."""
    await asyncio.sleep(1)  # Small delay to avoid detection
    ids = []
    
    lawyer_elements = await page.locator("//*[@id='myTable']/tbody/tr/td[1]/a").all()
    
    for element in lawyer_elements:
        onclick_attr = await element.get_attribute("onclick")
        if onclick_attr and "PageLink('Lawyerprofile','" in onclick_attr:
            lawyer_id = onclick_attr.split("PageLink('Lawyerprofile','")[1].split("')")[0]
            ids.append(lawyer_id)
    
    return ids

async def save_links_to_file(links):
    """Saves extracted links to a text file."""
    with open(LINKS_FILE, "a") as file:
        for link in links:
            file.write(link + "\n")
    print(f"Saved {len(links)} links to {LINKS_FILE}")

async def main():
    base_url = "https://www.sbnm.org/For-Public/I-Need-a-Lawyer/Online-Bar-Directory"
    profile_url_template = "https://www.sbnm.org/For-Public/I-Need-a-Lawyer/Online-Bar-Directory/Lawyer-Info/customercd/"
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # ✅ Open browser in visible mode
        context = await browser.new_context()
        page = await context.new_page()
        
        print("Opening website...")
        await page.goto(base_url, timeout=120000, wait_until="domcontentloaded")
        await asyncio.sleep(2)

        # ✅ Screenshot before interacting
        await page.screenshot(path="debug_before_search.png")
        print("Screenshot taken (debug_before_search.png)")

        # ✅ Improved Search Button Selection
        search_button = page.locator("button:has-text('SEARCH')")
        
        await search_button.wait_for(state="visible", timeout=120000)  # Ensure button is visible
        await search_button.click()
        
        print("Clicked Search button. Waiting for results...")
        await page.wait_for_load_state("networkidle")  # Wait for all requests to finish
        await asyncio.sleep(2)

        # ✅ Screenshot after search
        await page.screenshot(path="debug_after_search.png")
        print("Screenshot taken (debug_after_search.png)")

        current_page = 1
        max_pages = 854  # Set based on site structure

        if os.path.exists(LINKS_FILE):
            os.remove(LINKS_FILE)  # Clear previous data
        
        while current_page <= max_pages:
            print(f"Scraping page {current_page}...")
            
            lawyer_ids = await extract_lawyer_ids(page)
            
            if not lawyer_ids:
                print("No more IDs found. Stopping.")
                break
            
            profile_links = [profile_url_template + lawyer_id for lawyer_id in lawyer_ids]
            await save_links_to_file(profile_links)

            # ✅ Improved "Next Page" Handling (Clicking Arrow Button)
            next_button = page.locator("//*[@id='nextlnk']/i")

            if await next_button.count() == 0:
                print("No next button available. Stopping.")
                break
            
            # ✅ Click the next button
            await next_button.click()
            await page.wait_for_load_state("networkidle")
            await asyncio.sleep(2)  # Delay before next page
            
            current_page += 1
        
        await browser.close()
        print("Scraping completed.")

# Run the script
asyncio.run(main())
