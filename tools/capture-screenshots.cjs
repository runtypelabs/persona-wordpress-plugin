/**
 * Capture the real plugin UI after seeding screenshot-fixture.php in disposable WP.
 * Requires Playwright and its Chromium browser; see tools/screenshots.md.
 */
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs/promises');

const base = process.env.PERSONA_SCREENSHOT_URL || 'http://localhost:8894';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) {
  throw new Error('Capture is restricted to the local screenshot fixture.');
}
const output = path.resolve(__dirname, '../wordpress-org-assets');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1100 },
      deviceScaleFactor: 1,
      colorScheme: 'light',
    });
    const page = await context.newPage();
    await page.goto(`${base}/wp-login.php`);
    await page.locator('#user_login').fill(process.env.PERSONA_SCREENSHOT_USER || 'admin');
    await page.locator('#user_pass').fill(process.env.PERSONA_SCREENSHOT_PASSWORD || 'password');
    await Promise.all([
      page.waitForURL(/wp-admin/),
      page.locator('#wp-submit').click(),
    ]);
    await fs.mkdir(output, { recursive: true });
    const capture = async (number) => {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(output, `screenshot-${number}.png`) });
      console.log(`Captured screenshot-${number}.png`);
    };
    await page.goto(`${base}/wp-admin/options-general.php?page=persona-assistant&view=connection`);
    // Choose an actual form state without saving or fabricating connection status.
    await page.getByRole('radio', { name: /^Runtype/ }).check();
    await page.waitForTimeout(1000);
    await capture(1);
    await page.goto(`${base}/wp-admin/options-general.php?page=persona-assistant&view=brand`);
    await page.getByText('A little help, freshly baked.', { exact: true }).waitFor();
    await page.getByPlaceholder('What would you like to know?').waitFor({ state: 'visible' });
    await page.waitForTimeout(1500);
    await capture(2);
    await page.goto(`${base}/`);
    await page.getByRole('button', { name: 'Flour & Stone', exact: true }).click();
    await page.getByText('Demo mode — responses are simulated', { exact: true }).waitFor();
    await page.getByText(/This is a demo assistant/).waitFor();
    await page.getByPlaceholder('What would you like to know?').waitFor({ state: 'visible' });
    await page.waitForTimeout(1000);
    await capture(3);
    await page.goto(`${base}/assistant/`);
    await page.getByText('Demo mode — responses are simulated', { exact: true }).waitFor();
    await page.getByText(/This is a demo assistant/).waitFor();
    const composer = page.getByPlaceholder('What would you like to know?');
    await composer.waitFor({ state: 'visible' });
    await composer.fill('Hi');
    await composer.press('Enter');
    await page.getByText(/Hi — I'm a demo assistant running on/).waitFor();
    await page.getByText(/Pick one below, or ask me anything/).waitFor();
    await page.waitForTimeout(1000);
    await capture(4);
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
