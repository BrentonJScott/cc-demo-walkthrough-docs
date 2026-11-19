#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || 'demo@example.com';
const PASSWORD = process.env.PASSWORD || 'demo';
const ROOT = path.resolve(import.meta.dirname, '..');

async function shot(page, rel) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, fullPage: true });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.getByLabel('Email').fill(EMAIL);
await page.getByLabel('Password').fill(PASSWORD);
await shot(page, 'docs/assets/guides/add-new-recipe/step-1-login.png');
await page.locator('main.auth').getByRole('link', { name: 'Log in' }).click();
await page.waitForURL('**/recipes');
await shot(page, 'docs/assets/guides/add-new-recipe/step-2-new-recipe-btn.png');
await page.getByRole('button', { name: 'New recipe' }).click();
await page.locator('#recipe-name').fill('Tomato soup');
await page.locator('#recipe-description').fill('A quick weeknight soup.');
await shot(page, 'docs/assets/guides/add-new-recipe/step-3-name-description.png');
await page.locator('#recipe-time').fill('45 min');
await page.locator('#recipe-serves').fill('4');
await shot(page, 'docs/assets/guides/add-new-recipe/step-4-time-serves.png');
await page.locator('#recipe-ingredients').fill('Tomatoes, 6\nOnion, 1\nVegetable stock, 500 ml');
await shot(page, 'docs/assets/guides/add-new-recipe/step-5-ingredients.png');
await page.getByRole('button', { name: 'Save recipe' }).click();
await page.getByRole('button', { name: /Tomato soup/i }).waitFor({ state: 'visible' });
await shot(page, 'docs/assets/guides/add-new-recipe/step-6-saved.png');

await browser.close();
console.log('add-new-recipe screenshots captured');