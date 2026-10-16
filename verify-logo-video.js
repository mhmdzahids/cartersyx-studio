import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge' });

  console.log('=== BRAND LOGO & CLOUDINARY SHOWREEL VERIFICATION ===');

  // Test 1: Light Mode
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('header');

    // Check Header Logo
    const headerLogoLight = await page.evaluate(() => {
      const img = document.querySelector('header a[aria-label="Cartesyx Studio Homepage"] img');
      const style = img ? window.getComputedStyle(img) : null;
      return {
        src: img?.src,
        filter: style?.filter,
        width: img?.clientWidth,
        height: img?.clientHeight,
      };
    });
    console.log('1. Header logo in LIGHT mode:', headerLogoLight);

    // Check Showreel Topbar Logo
    const showreelLogoLight = await page.evaluate(() => {
      const img = document.querySelector('#reel .showreel-topbar img');
      const style = img ? window.getComputedStyle(img) : null;
      return {
        src: img?.src,
        filter: style?.filter,
        width: img?.clientWidth,
        height: img?.clientHeight,
      };
    });
    console.log('2. Showreel topbar logo in LIGHT mode:', showreelLogoLight);

    // Scroll to Showreel to trigger source load and playback
    await page.evaluate(() => {
      document.querySelector('#reel')?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(3000);

    // Check Showreel video source and playback
    const videoDataLight = await page.evaluate(() => {
      const v = document.querySelector('#reel video');
      const source = v ? v.querySelector('source') : null;
      const tc = document.querySelector('#reel .tabular-nums')?.textContent?.trim();
      return {
        sourceSrc: source?.src,
        duration: v?.duration,
        currentTime: v?.currentTime,
        paused: v?.paused,
        timecodeText: tc,
      };
    });
    console.log('3. Showreel video & timecode in LIGHT mode:', videoDataLight);

    // Screenshots
    await page.locator('header').screenshot({ path: 'screenshots/header-light.png' });
    await page.locator('#reel').screenshot({ path: 'screenshots/showreel-cloudinary-light.png' });

    await page.close();
  }

  // Test 2: Dark Mode
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('header');

    // Check Header Logo
    const headerLogoDark = await page.evaluate(() => {
      const img = document.querySelector('header a[aria-label="Cartesyx Studio Homepage"] img');
      const style = img ? window.getComputedStyle(img) : null;
      return {
        src: img?.src,
        filter: style?.filter,
        width: img?.clientWidth,
        height: img?.clientHeight,
      };
    });
    console.log('4. Header logo in DARK mode (expect filter: invert(1)):', headerLogoDark);

    // Check Showreel Topbar Logo
    const showreelLogoDark = await page.evaluate(() => {
      const img = document.querySelector('#reel .showreel-topbar img');
      const style = img ? window.getComputedStyle(img) : null;
      return {
        src: img?.src,
        filter: style?.filter,
        width: img?.clientWidth,
        height: img?.clientHeight,
      };
    });
    console.log('5. Showreel topbar logo in DARK mode (expect filter: invert(1)):', showreelLogoDark);

    // Scroll to Showreel
    await page.evaluate(() => {
      document.querySelector('#reel')?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(2000);

    // Screenshots
    await page.locator('header').screenshot({ path: 'screenshots/header-dark.png' });
    await page.locator('#reel').screenshot({ path: 'screenshots/showreel-cloudinary-dark.png' });

    await page.close();
  }

  // Test 3: Mobile 375px Header & Showreel Topbar
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('header');

    await page.locator('header').screenshot({ path: 'screenshots/header-mobile-light.png' });

    const mobileCheck = await page.evaluate(() => {
      const headerImg = document.querySelector('header a[aria-label="Cartesyx Studio Homepage"] img');
      const reelImg = document.querySelector('#reel .showreel-topbar img');
      const hRect = headerImg?.getBoundingClientRect();
      const rRect = reelImg?.getBoundingClientRect();
      return {
        headerLogoVisible: hRect ? hRect.width > 0 && hRect.right <= 375 : false,
        reelLogoVisible: rRect ? rRect.width > 0 && rRect.right <= 375 : false,
      };
    });
    console.log('6. Mobile 375px logo visibility:', mobileCheck);

    await page.close();
  }

  await browser.close();
  console.log('=== VERIFICATION FINISHED ===');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
