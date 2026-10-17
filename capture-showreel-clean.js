import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge' });

  // Light Mode
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#reel');

    await page.evaluate(() => {
      document.querySelector('#reel')?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(2000);

    const controlsCheck = await page.evaluate(() => {
      const playBtn = document.querySelector('#reel button[aria-label*="showreel"]');
      const timecode = document.querySelector('#reel .tabular-nums');
      return {
        hasPlayBtn: Boolean(playBtn),
        hasTimecode: Boolean(timecode),
      };
    });
    console.log('Controls check in Light Mode (expect both false):', controlsCheck);

    await page.locator('#reel').screenshot({ path: 'screenshots/showreel-clean-light.png' });
    await page.close();
  }

  // Dark Mode
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#reel');

    await page.evaluate(() => {
      document.querySelector('#reel')?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(2000);

    await page.locator('#reel').screenshot({ path: 'screenshots/showreel-clean-dark.png' });
    await page.close();
  }

  await browser.close();
  console.log('Capture complete.');
}

main().catch(console.error);
