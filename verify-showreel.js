import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge' });

  console.log('=== SHOWREEL & SELECTED WORK VERIFICATION ===');

  // Test 1: Desktop 1440px
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    
    // Check lazy loading with element initially outside 600px threshold
    const lazyPage = await browser.newPage({ viewport: { width: 1440, height: 800 } });
    await lazyPage.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = 'main > section:first-of-type { margin-bottom: 3000px !important; }';
      if (document.head) {
        document.head.appendChild(style);
      } else {
        document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
      }
    });
    await lazyPage.goto('http://localhost:4173/');
    await lazyPage.waitForSelector('#reel');

    const sourcesBeforeScroll = await lazyPage.evaluate(() => {
      const v = document.querySelector('#reel video');
      return v ? v.querySelectorAll('source').length : -1;
    });
    console.log('1. Video sources count before entering 600px threshold (expect 0):', sourcesBeforeScroll);

    // Scroll to within 600px of #reel (scroll near it)
    await lazyPage.evaluate(() => {
      document.querySelector('#reel')?.scrollIntoView({ block: 'nearest' });
    });
    await lazyPage.waitForTimeout(400);

    const sourcesAfterScroll = await lazyPage.evaluate(() => {
      const v = document.querySelector('#reel video');
      return v ? v.querySelectorAll('source').length : -1;
    });
    console.log('2. Video sources count after entering 600px threshold (expect > 0):', sourcesAfterScroll);
    await lazyPage.close();

    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#reel');

    // Scroll Showreel to center to trigger autoplay (>= 50% visible)
    await page.evaluate(() => {
      document.querySelector('#reel')?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(2000);

    // Check timecode updates
    const timecodeData = await page.evaluate(() => {
      const tc = document.querySelector('#reel .tabular-nums')?.textContent?.trim();
      const v = document.querySelector('#reel video');
      return {
        timecodeText: tc,
        currentTime: v?.currentTime,
        duration: v?.duration,
        paused: v?.paused,
      };
    });
    console.log('3. Timecode & Video playback test at 1440px:', timecodeData);

    // Panel width at 1440px
    const panelWidth1440 = await page.evaluate(() => {
      const p = document.querySelector('#reel .showreel-panel');
      const s = p ? window.getComputedStyle(p) : null;
      const rect = p?.getBoundingClientRect();
      return {
        width: rect?.width,
        height: rect?.height,
        maxWidth: s?.maxWidth,
        margin: s?.margin,
      };
    });
    console.log('4. Panel width and metrics at 1440px (expect maxWidth: 1240px, width: 1240px):', panelWidth1440);

    // Selected Work placeholder media background check in LIGHT theme
    const workMediaLight = await page.evaluate(() => {
      const el = document.querySelector('#work .project-card-media');
      return el ? window.getComputedStyle(el).backgroundColor : null;
    });
    console.log('5. Selected Work placeholder background in LIGHT theme (expect rgba(64, 64, 64, 0.08)):', workMediaLight);

    // Screenshots at 1440px light
    const reelLocator = page.locator('#reel');
    await reelLocator.screenshot({ path: 'screenshots/showreel-1440-light.png' });
    await page.screenshot({ path: 'screenshots/showreel-1440-light-full.png', fullPage: true });

    await page.close();
  }

  // Test 2: Desktop 1440px Dark
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('h1');

    // Selected Work placeholder media background check in DARK theme
    const workMediaDark = await page.evaluate(() => {
      const el = document.querySelector('#work .project-card-media');
      return el ? window.getComputedStyle(el).backgroundColor : null;
    });
    console.log('6. Selected Work placeholder background in DARK theme (expect rgb(29, 29, 29)):', workMediaDark);

    const reelLocator = page.locator('#reel');
    await reelLocator.screenshot({ path: 'screenshots/showreel-1440-dark.png' });
    await page.screenshot({ path: 'screenshots/showreel-1440-dark-full.png', fullPage: true });

    await page.close();
  }

  // Test 3: Mobile 375px Light
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('h1');

    // Window overflow and horizontal scroll check at 375px
    const mobileMetrics = await page.evaluate(() => {
      const p = document.querySelector('#reel .showreel-panel');
      const w = document.querySelector('#reel .showreel-window');
      const pRect = p?.getBoundingClientRect();
      const wRect = w?.getBoundingClientRect();

      const btn = document.querySelector('#reel button[aria-label]');
      const btnRect = btn?.getBoundingClientRect();

      return {
        panelWidth: pRect?.width,
        windowWidth: wRect?.width,
        windowLeftRelativeToPanel: (wRect?.left || 0) - (pRect?.left || 0),
        windowRightOverflowsScreen: (wRect?.right || 0) > 375,
        windowRight: wRect?.right,
        controlsFullyVisible: btnRect ? btnRect.left >= 0 && btnRect.right <= 375 : false,
        btnHitWidth: btnRect?.width,
        btnHitHeight: btnRect?.height,
        scrollWidth: document.scrollingElement.scrollWidth,
        innerWidth: window.innerWidth,
        noHorizontalScroll: document.scrollingElement.scrollWidth === window.innerWidth,
      };
    });
    console.log('7. Mobile 375px Metrics and Overflow Analysis:', mobileMetrics);

    const reelLocator = page.locator('#reel');
    await reelLocator.screenshot({ path: 'screenshots/showreel-375-light.png' });
    await page.screenshot({ path: 'screenshots/showreel-375-light-full.png', fullPage: true });

    await page.close();
  }

  // Test 4: Mobile 375px Dark
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('h1');

    const reelLocator = page.locator('#reel');
    await reelLocator.screenshot({ path: 'screenshots/showreel-375-dark.png' });
    await page.screenshot({ path: 'screenshots/showreel-375-dark-full.png', fullPage: true });

    await page.close();
  }

  // Test 5: Multi-breakpoint responsive check (390, 768, 1024, 1280)
  for (const width of [390, 768, 1024, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#reel');
    const scrollOk = await page.evaluate(() => document.scrollingElement.scrollWidth === window.innerWidth);
    console.log(`8. Viewport ${width}px horizontal scroll check:`, scrollOk ? 'Pass' : 'FAIL');
    await page.close();
  }

  await browser.close();
  console.log('=== VERIFICATION COMPLETE ===');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
