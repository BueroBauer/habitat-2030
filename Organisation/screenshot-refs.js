const { chromium } = require('playwright');
const path = require('path');

const sites = [
  { url: 'https://gravityclimate.com', name: 'tool_gravity-climate' },
  { url: 'https://architecture2030.org', name: 'tool_architecture-2030' },
  { url: 'https://urbaninnovation.at', name: 'tool_urban-innovation-vienna' },
  { url: 'https://creativemornings.com/cities/vie', name: 'community_creative-mornings-vienna' },
  { url: 'https://zukunftsinstitut.de', name: 'community_zukunftsinstitut' },
  { url: 'https://systemchange-not-climatechange.at', name: 'community_system-change' },
  { url: 'https://atmos.earth', name: 'community_atmos-earth' },
  { url: 'https://ig-architektur.at', name: 'netzwerk_ig-architektur' },
  { url: 'https://wohnbund.at', name: 'netzwerk_wohnbund' },
  { url: 'https://dgnb.de', name: 'netzwerk_dgnb' },
  { url: 'https://worldgbc.org', name: 'netzwerk_worldgbc' },
  { url: 'https://ventureclimatealliance.org', name: 'netzwerk_venture-climate-alliance' },
  { url: 'https://klimabuendnis.at', name: 'co2_klimabuendnis' },
];

const outputDir = '/Users/mark/Documents/Obsidian/MeinVault/Projekte/habitat2030/referenzen-screenshots';

(async () => {
  const browser = await chromium.launch();

  for (const site of sites) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    try {
      await page.goto(site.url, { waitUntil: 'networkidle', timeout: 15000 });
    } catch {
      try {
        await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      } catch (e2) {
        console.log(`✗ ${site.name} — übersprungen (${e2.message.split('\n')[0]})`);
        await context.close();
        continue;
      }
    }

    await page.waitForTimeout(1500);

    // Cookie-Banner entfernen
    await page.evaluate(() => {
      const selectors = [
        '[id*="cookie"]', '[class*="cookie"]', '[id*="consent"]', '[class*="consent"]',
        '[id*="gdpr"]', '[class*="gdpr"]', '[id*="banner"]', '[class*="CookieBanner"]',
        '[class*="cc-"]', '[id*="cc-"]', '[aria-label*="cookie"]', '[class*="popup"]',
        'div[class*="Cookie"]', 'div[class*="Consent"]'
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
    });

    const filePath = path.join(outputDir, `${site.name}.png`);
    await page.screenshot({ path: filePath, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log(`✓ ${site.name}`);
    await context.close();
  }

  await browser.close();
  console.log('Fertig.');
})();
