import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge' });

  console.log('=== SERVICES SECTION & VIDEO EDITING CARD VERIFICATION ===');

  const viewports = [375, 390, 768, 1024, 1280, 1440];
  const viewportResults = {};

  // Test across all required viewports
  for (const width of viewports) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');

    const metrics = await page.evaluate(() => {
      const card = document.querySelector('#services ul > li:first-child .service-mobbin-card');
      const label = card ? card.querySelector('h3') : null;
      const wrapper = card ? card.querySelector('.service-mobbin-card div[style*="aspect-ratio"], .service-mobbin-card .aspect-\\[9\\/14\\]') : null;

      const cardRect = card ? card.getBoundingClientRect() : null;
      const labelRect = label ? label.getBoundingClientRect() : null;
      const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : null;

      const cardWidth = cardRect ? cardRect.width : 0;
      const cardHeight = cardRect ? cardRect.height : 0;
      const wrapperWidth = wrapperRect ? wrapperRect.width : 0;
      const wrapperHeight = wrapperRect ? wrapperRect.height : 0;

      const labelBottom = labelRect ? labelRect.bottom : 0;
      const wrapperTop = wrapperRect ? wrapperRect.top : 0;
      const clearanceFromLabel = wrapperTop - labelBottom;

      const widthPct = cardWidth > 0 ? (wrapperWidth / cardWidth) * 100 : 0;
      const overflowsCard = wrapperRect && cardRect ? (
        wrapperRect.top < cardRect.top ||
        wrapperRect.bottom > cardRect.bottom + 1 ||
        wrapperRect.left < cardRect.left ||
        wrapperRect.right > cardRect.right + 1
      ) : true;

      return {
        cardWidth,
        cardHeight,
        wrapperWidth,
        wrapperHeight,
        widthPct: Number(widthPct.toFixed(2)),
        clearanceFromLabel: Number(clearanceFromLabel.toFixed(2)),
        clearanceAtLeast56: clearanceFromLabel >= 55.5, // allow rounding
        overflowsCard,
        horizontalScrollOk: document.scrollingElement.scrollWidth === window.innerWidth,
      };
    });

    viewportResults[width] = metrics;
    await page.close();
  }

  console.log('1. Metrics across viewports:', JSON.stringify(viewportResults, null, 2));

  // Test 2: DOM Order & Text Content Check
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');

    const domOrder = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services ul > li'));
      return cards.map((li) => {
        const title = li.querySelector('h3 span')?.textContent?.trim();
        const soon = li.querySelector('h3 span[aria-label]') ? true : false;
        return { title, soon };
      });
    });
    console.log('2. DOM Order of the 4 cards:', domOrder);

    // Test Lazy Loading
    // On load, page is at top (services is > 1500px down)
    const sourcesBeforeScroll = await page.evaluate(() => {
      const v = document.querySelector('#services video');
      return v ? v.querySelectorAll('source').length : -1;
    });
    console.log('3. Video sources count before entering 600px threshold (expect 0):', sourcesBeforeScroll);

    // Scroll to within 600px of services
    await page.evaluate(() => {
      const s = document.querySelector('#services');
      const rect = s?.getBoundingClientRect();
      const currentScroll = window.scrollY;
      const targetScroll = currentScroll + (rect?.top || 0) - 500;
      window.scrollTo({ top: targetScroll });
    });
    await page.waitForTimeout(400);

    const sourcesAfterScroll = await page.evaluate(() => {
      const v = document.querySelector('#services video');
      return v ? v.querySelectorAll('source').length : -1;
    });
    console.log('4. Video sources count after entering 600px threshold (expect > 0):', sourcesAfterScroll);

    // Scroll card to center for autoplay (>= 50% visibility)
    await page.evaluate(() => {
      document.querySelector('#services ul > li:first-child')?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(2000);

    const playbackCheck = await page.evaluate(() => {
      const v = document.querySelector('#services video');
      return {
        paused: v?.paused,
        currentTime: v?.currentTime,
        duration: v?.duration,
      };
    });
    console.log('5. Autoplay when card >= 50% visible:', playbackCheck);

    // Play/Pause button hit area and styling check
    const buttonMetrics = await page.evaluate(() => {
      const btn = document.querySelector('#services button[aria-label*="video"]');
      const iconWrap = btn ? btn.querySelector('span') : null;
      const btnRect = btn?.getBoundingClientRect();
      const iconRect = iconWrap?.getBoundingClientRect();
      const wrapperRect = btn?.closest('.aspect-\\[9\\/14\\]')?.getBoundingClientRect();

      const offsetLeft = btnRect && wrapperRect ? iconRect.left - wrapperRect.left : -1;
      const offsetBottom = btnRect && wrapperRect ? wrapperRect.bottom - iconRect.bottom : -1;

      return {
        btnHitWidth: btnRect?.width,
        btnHitHeight: btnRect?.height,
        iconWidth: iconRect?.width,
        iconHeight: iconRect?.height,
        ariaLabel: btn?.getAttribute('aria-label'),
        offsetLeft: Math.round(offsetLeft),
        offsetBottom: Math.round(offsetBottom),
      };
    });
    console.log('6. Play/pause button metrics:', buttonMetrics);

    // Screenshots at 1440px Light
    await page.locator('#services').screenshot({ path: 'screenshots/services-1440-light.png' });

    // Test Dark Mode
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.reload();
    await page.waitForSelector('#services');
    await page.evaluate(() => {
      document.querySelector('#services ul > li:first-child')?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(1000);
    await page.locator('#services').screenshot({ path: 'screenshots/services-1440-dark.png' });

    await page.close();
  }

  // Test 3: Mobile Screenshots (375px)
  {
    // Light
    const pageLight = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await pageLight.goto('http://localhost:4173/');
    await pageLight.waitForSelector('#services');
    await pageLight.evaluate(() => {
      document.querySelector('#services ul > li:first-child')?.scrollIntoView({ block: 'center' });
    });
    await pageLight.waitForTimeout(1000);
    await pageLight.locator('#services').screenshot({ path: 'screenshots/services-375-light.png' });
    await pageLight.close();

    // Dark
    const pageDark = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await pageDark.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await pageDark.goto('http://localhost:4173/');
    await pageDark.waitForSelector('#services');
    await pageDark.evaluate(() => {
      document.querySelector('#services ul > li:first-child')?.scrollIntoView({ block: 'center' });
    });
    await pageDark.waitForTimeout(1000);
    await pageDark.locator('#services').screenshot({ path: 'screenshots/services-375-dark.png' });
    await pageDark.close();
  }

  await browser.close();
  console.log('=== VERIFICATION COMPLETED ===');
}

main().catch(console.error);
