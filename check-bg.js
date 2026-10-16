import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto('http://localhost:4173/');
  const result = await page.evaluate(() => {
    const el = document.querySelector('#work [data-placeholder="true"]')?.parentElement;
    if (!el) return 'none';
    const s = window.getComputedStyle(el);
    return {
      bg: s.backgroundColor,
      border: s.border,
      className: el.className
    };
  });
  console.log('Result:', result);
  await browser.close();
}

check().catch(console.error);
