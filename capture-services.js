import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch({ channel: 'msedge' });

  // 1. 1440px Light Theme
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');
    await page.evaluate(() => {
      const h = document.querySelector('header');
      if (h) h.style.display = 'none';
    });
    const services = page.locator('#services');
    await services.screenshot({ path: 'screenshots/services-1440-light.png' });
    await page.close();
  }

  // 2. 1440px Dark Theme
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');
    await page.evaluate(() => {
      const h = document.querySelector('header');
      if (h) h.style.display = 'none';
    });
    const services = page.locator('#services');
    await services.screenshot({ path: 'screenshots/services-1440-dark.png' });
    await page.close();
  }

  // 3. 375px Mobile Light Theme
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');
    await page.evaluate(() => {
      const h = document.querySelector('header');
      if (h) h.style.display = 'none';
    });
    const services = page.locator('#services');
    await services.screenshot({ path: 'screenshots/services-375-light.png' });
    await page.close();
  }

  // 4. 375px Mobile Dark Theme
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');
    await page.evaluate(() => {
      const h = document.querySelector('header');
      if (h) h.style.display = 'none';
    });
    const services = page.locator('#services');
    await services.screenshot({ path: 'screenshots/services-375-dark.png' });
    await page.close();
  }

  await browser.close();
  console.log('All 4 section screenshots captured successfully.');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
