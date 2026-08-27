/* Headless-Browser-Diagnose: fängt Konsole, Page-Errors und fehlgeschlagene
 * Requests auf /typeracer ein und macht einen Screenshot. */
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:4185';
const path = process.argv[2] ?? '/typeracer';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

// Simulation: indexedDB.open hängt für immer (blockiertes Upgrade etc.)
if (process.env.BLOCK_DB === '1') {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', {
      value: {
        open: () => ({
          addEventListener() {},
          removeEventListener() {},
          set onsuccess(_) {},
          set onerror(_) {},
          set onupgradeneeded(_) {},
        }),
        deleteDatabase: () => ({}),
      },
      configurable: true,
    });
  });
}

const logs = [];
page.on('console', (msg) => logs.push(`[console.${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}\n${(err.stack ?? '').split('\n').slice(0, 4).join('\n')}`));
page.on('requestfailed', (req) => logs.push(`[requestfailed] ${req.url()} :: ${req.failure()?.errorText}`));
page.on('response', (res) => {
  if (res.status() >= 400) logs.push(`[http ${res.status()}] ${res.url()}`);
});

await page.goto(BASE + path, { waitUntil: 'networkidle' });
// Im Blockiert-Fall erst über den 3s-Hydration-Timeout hinaus warten.
await page.waitForTimeout(process.env.BLOCK_DB === '1' ? 5000 : 1200);

const rootHtmlLength = await page.evaluate(() => document.getElementById('root')?.innerHTML.length ?? 0);
const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const htmlClasses = await page.evaluate(() => document.documentElement.className);
const visibleText = (await page.evaluate(() => document.body.innerText)).slice(0, 300);

console.log('=== DIAGNOSE', path, '===');
console.log('root.innerHTML.length:', rootHtmlLength);
console.log('body bg:', bodyBg, '· html class:', JSON.stringify(htmlClasses));
console.log('sichtbarer Text:', JSON.stringify(visibleText));
console.log('--- Logs ---');
for (const line of logs) console.log(line);
if (logs.length === 0) console.log('(keine Console-/Netzwerkfehler)');

await page.screenshot({ path: `/tmp/opencode/screen-${path.replace(/\//g, '_') || '_root'}.png`, fullPage: false });
await browser.close();
