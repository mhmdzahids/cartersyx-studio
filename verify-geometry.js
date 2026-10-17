import { chromium } from 'playwright';
import fs from 'fs';

async function verify() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const viewports = [390, 375, 768, 1024, 1440];
  const results = {};

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots', { recursive: true });
  }

  for (const width of viewports) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');

    // Wait a brief moment for layout/ResizeObserver
    await page.waitForTimeout(500);

    const data = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services ul > li .service-mobbin-card'));
      const ul = document.querySelector('#services ul');
      const ulComputed = window.getComputedStyle(ul);
      const cardGap = ulComputed.rowGap || ulComputed.gap;

      const cardData = cards.map((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const label = card.querySelector('h3');
        const labelRect = label ? label.getBoundingClientRect() : null;
        const labelComputed = label ? window.getComputedStyle(label) : null;

        // Media area (row-start-2)
        const mediaArea = card.querySelector('.service-card-media');
        const mediaAreaRect = mediaArea ? mediaArea.getBoundingClientRect() : null;

        // Visual or video button
        const visualOrBtn = card.querySelector('.service-video-button, .service-card-media > div');
        const visualRect = visualOrBtn ? visualOrBtn.getBoundingClientRect() : null;

        const distanceTopToLabel = labelRect ? labelRect.top - cardRect.top : null;
        const distanceTopToMediaArea = mediaAreaRect ? mediaAreaRect.top - cardRect.top : null;
        const distanceTopToVisual = visualRect ? visualRect.top - cardRect.top : null;

        const gapLabelToMediaArea = (labelRect && mediaAreaRect) ? mediaAreaRect.top - labelRect.bottom : null;
        const gapLabelToVisual = (labelRect && visualRect) ? visualRect.top - labelRect.bottom : null;

        const videoBtn = card.querySelector('.service-video-button');
        let videoWrapperPct = null;
        if (videoBtn) {
          const btnRect = videoBtn.getBoundingClientRect();
          videoWrapperPct = (btnRect.width / cardRect.width) * 100;
        }

        return {
          index: index + 1,
          offsetHeight: card.offsetHeight,
          cardWidth: Math.round(cardRect.width * 10) / 10,
          cardHeight: Math.round(cardRect.height * 10) / 10,
          fontSize: labelComputed ? labelComputed.fontSize : null,
          fontWeight: labelComputed ? labelComputed.fontWeight : null,
          lineHeight: labelComputed ? labelComputed.lineHeight : null,
          distanceTopToLabel: distanceTopToLabel !== null ? Math.round(distanceTopToLabel * 10) / 10 : null,
          distanceTopToMediaArea: distanceTopToMediaArea !== null ? Math.round(distanceTopToMediaArea * 10) / 10 : null,
          distanceTopToVisual: distanceTopToVisual !== null ? Math.round(distanceTopToVisual * 10) / 10 : null,
          gapLabelToMediaArea: gapLabelToMediaArea !== null ? Math.round(gapLabelToMediaArea * 10) / 10 : null,
          gapLabelToVisual: gapLabelToVisual !== null ? Math.round(gapLabelToVisual * 10) / 10 : null,
          videoWrapperPct: videoWrapperPct !== null ? Math.round(videoWrapperPct * 100) / 100 : null,
        };
      });

      return {
        cardGap,
        cards: cardData,
      };
    });

    results[width] = data;
    await page.close();
  }

  console.log('=== METRICS REPORT ACROSS VIEWPORTS ===');
  console.log(JSON.stringify(results, null, 2));

  // Test Interaction: Tab + Space, play/pause state
  console.log('\n=== TESTING VIDEO INTERACTION (Tab + Space & Play Icon) ===');
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');

    // Scroll card into center to allow autoplay
    await page.evaluate(() => {
      document.querySelector('#services ul > li:first-child')?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(2000);

    const playingState = await page.evaluate(() => {
      const video = document.querySelector('#services video');
      const playIcon = document.querySelector('#services .service-video-button span');
      const btn = document.querySelector('#services .service-video-button');
      return {
        paused: video ? video.paused : null,
        ariaLabel: btn ? btn.getAttribute('aria-label') : null,
        playIconVisible: playIcon !== null,
      };
    });
    console.log('During playback check:', playingState);

    // Now test Tab to button and Space to pause
    const btnHandle = await page.$('#services .service-video-button');
    await btnHandle.focus();

    const isFocused = await page.evaluate(() => {
      const btn = document.querySelector('#services .service-video-button');
      return document.activeElement === btn;
    });
    console.log('Button focused via Tab:', isFocused);

    // Press Space to toggle pause
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    const pausedState = await page.evaluate(() => {
      const video = document.querySelector('#services video');
      const playIcon = document.querySelector('#services .service-video-button span');
      const btn = document.querySelector('#services .service-video-button');
      const playIconComputed = playIcon ? window.getComputedStyle(playIcon) : null;
      return {
        paused: video ? video.paused : null,
        ariaLabel: btn ? btn.getAttribute('aria-label') : null,
        playIconVisible: playIcon !== null,
        playIconWidth: playIconComputed ? playIconComputed.width : null,
        playIconHeight: playIconComputed ? playIconComputed.height : null,
        playIconBg: playIconComputed ? playIconComputed.backgroundColor : null,
      };
    });
    console.log('After Space keypress (paused state):', pausedState);

    // Press Space again to resume playback
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    const resumedState = await page.evaluate(() => {
      const video = document.querySelector('#services video');
      const playIcon = document.querySelector('#services .service-video-button span');
      const btn = document.querySelector('#services .service-video-button');
      return {
        paused: video ? video.paused : null,
        ariaLabel: btn ? btn.getAttribute('aria-label') : null,
        playIconVisible: playIcon !== null,
      };
    });
    console.log('After 2nd Space keypress (resumed state):', resumedState);

    await page.close();
  }

  // Capture Screenshots: 390px and 1440px in light and dark mode
  console.log('\n=== CAPTURING SCREENSHOTS ===');
  // 1440px Light
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');
    await page.evaluate(() => {
      document.querySelector('#services')?.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(1000);
    await page.locator('#services').screenshot({ path: 'screenshots/services-1440-light.png' });
    console.log('Saved screenshots/services-1440-light.png');
    await page.close();
  }

  // 1440px Dark
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');
    await page.evaluate(() => {
      document.querySelector('#services')?.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(1000);
    await page.locator('#services').screenshot({ path: 'screenshots/services-1440-dark.png' });
    console.log('Saved screenshots/services-1440-dark.png');
    await page.close();
  }

  // 390px Light
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');
    await page.evaluate(() => {
      document.querySelector('#services')?.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(1000);
    await page.locator('#services').screenshot({ path: 'screenshots/services-390-light.png' });
    console.log('Saved screenshots/services-390-light.png');
    await page.close();
  }

  // 390px Dark
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('#services');
    await page.evaluate(() => {
      document.querySelector('#services')?.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(1000);
    await page.locator('#services').screenshot({ path: 'screenshots/services-390-dark.png' });
    console.log('Saved screenshots/services-390-dark.png');
    await page.close();
  }

  await browser.close();
  console.log('=== VERIFICATION SCRIPT COMPLETE ===');
}

verify().catch(console.error);
