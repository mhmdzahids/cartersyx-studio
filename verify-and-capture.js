import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge' });

  console.log('=== RUNNING AUTOMATED VERIFICATION ===');

  // Test 1: 375px Mobile Light
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('h1');

    // 1. Check computed H1 size and weight at 375px
    const h1Styles = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      const s = window.getComputedStyle(h1);
      return {
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
      };
    });
    console.log('1. Computed H1 at 375px:', h1Styles);

    // 2. Check no element on page uses a monospace family
    const monospaceElements = await page.evaluate(() => {
      const all = document.querySelectorAll('*');
      const bad = [];
      for (const el of all) {
        const ff = window.getComputedStyle(el).fontFamily.toLowerCase();
        if (ff.includes('mono') || ff.includes('courier') || ff.includes('consolas')) {
          bad.push({ tag: el.tagName, class: el.className, text: el.textContent?.slice(0, 30) });
        }
      }
      return bad;
    });
    console.log('2. Monospace elements count:', monospaceElements.length, monospaceElements);

    // 3. Check every project card contains exactly: media, title, year, one discipline line
    const projectCardsAudit = await page.evaluate(() => {
      const cards = document.querySelectorAll('#work a[aria-label]');
      return Array.from(cards).map((card) => {
        const media = card.querySelector('.aspect-\\[3\\/2\\]') !== null;
        const title = card.querySelector('h3')?.textContent?.trim();
        const year = card.querySelector('span.type-meta')?.textContent?.trim();
        const discipline = card.querySelector('p.type-meta')?.textContent?.trim();
        return {
          title,
          hasMedia: media,
          year,
          discipline,
          allPresent: Boolean(media && title && year && discipline),
        };
      });
    });
    console.log('3. Project cards audit:', projectCardsAudit);

    // 4. Check no text node contains "576" or "preview"
    const forbiddenTextNodes = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const matches = [];
      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent?.toLowerCase() || '';
        if (text.includes('576') || text.includes('preview')) {
          // exclude script/style
          if (node.parentElement?.tagName !== 'SCRIPT' && node.parentElement?.tagName !== 'STYLE') {
            matches.push({ parent: node.parentElement?.tagName, text: node.textContent?.trim() });
          }
        }
      }
      return matches;
    });
    console.log('4. Forbidden text nodes count ("576" or "preview"):', forbiddenTextNodes.length, forbiddenTextNodes);

    // 5. Check no horizontal scroll at 375px
    const scrollAudit = await page.evaluate(() => {
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    console.log('5. Horizontal scroll audit at 375px:', scrollAudit);

    // Capture screenshots at 375px light
    await page.screenshot({ path: 'screenshots/mobile-375-light-full.png', fullPage: true });

    // Capture Work section specifically
    const workSection = page.locator('#work');
    await workSection.screenshot({ path: 'screenshots/mobile-375-work-light.png' });

    // Capture Footer section specifically
    const footerSection = page.locator('footer');
    await footerSection.screenshot({ path: 'screenshots/mobile-375-footer-light.png' });

    await page.close();
  }

  // Test 2: 375px Mobile Dark
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('h1');
    await page.screenshot({ path: 'screenshots/mobile-375-dark-full.png', fullPage: true });

    const workSection = page.locator('#work');
    await workSection.screenshot({ path: 'screenshots/mobile-375-work-dark.png' });

    const footerSection = page.locator('footer');
    await footerSection.screenshot({ path: 'screenshots/mobile-375-footer-dark.png' });

    await page.close();
  }

  // Test 3: 1440px Desktop Light
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('h1');

    await page.screenshot({ path: 'screenshots/desktop-1440-light-full.png', fullPage: true });

    const workSection = page.locator('#work');
    await workSection.screenshot({ path: 'screenshots/desktop-1440-work-light.png' });

    const footerSection = page.locator('footer');
    await footerSection.screenshot({ path: 'screenshots/desktop-1440-footer-light.png' });

    await page.close();
  }

  // Test 4: 1440px Desktop Dark
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    await page.addInitScript(() => {
      localStorage.setItem('cartesyx-theme', 'dark');
    });
    await page.goto('http://localhost:4173/');
    await page.waitForSelector('h1');

    await page.screenshot({ path: 'screenshots/desktop-1440-dark-full.png', fullPage: true });

    const workSection = page.locator('#work');
    await workSection.screenshot({ path: 'screenshots/desktop-1440-work-dark.png' });

    const footerSection = page.locator('footer');
    await footerSection.screenshot({ path: 'screenshots/desktop-1440-footer-dark.png' });

    await page.close();
  }

  await browser.close();
  console.log('Verification and screenshots complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
