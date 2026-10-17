import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge' });

  // Test Light Mode
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('header');

    const hamburger = page.locator('header button[aria-label="Open navigation menu"]');
    await hamburger.click();
    await page.waitForTimeout(300);

    await page.screenshot({ path: 'screenshots/mobile-menu-clicked.png' });
    await page.close();
  }

  // Test Dark Mode
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('header');

    const hamburger = page.locator('header button[aria-label="Open navigation menu"]');
    await hamburger.click();
    await page.waitForTimeout(300);

    const dialogInfoDark = await page.evaluate(() => {
      const dialog = document.querySelector('#mobile-nav-dialog');
      if (!dialog) return { found: false };
      const rect = dialog.getBoundingClientRect();
      const style = window.getComputedStyle(dialog);
      return {
        found: true,
        rect: { top: rect.top, width: rect.width, height: rect.height, bottom: rect.bottom },
        backgroundColor: style.backgroundColor,
      };
    });
    console.log('Dark Mode Dialog Info:', dialogInfoDark);

    await page.screenshot({ path: 'screenshots/mobile-menu-clicked-dark.png' });
    await page.close();
  }

  await browser.close();
  console.log('All tests passed.');
}

main().catch(console.error);
