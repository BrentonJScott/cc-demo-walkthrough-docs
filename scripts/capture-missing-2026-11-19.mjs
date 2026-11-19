#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || '';
const PASSWORD = process.env.PASSWORD || '';
const ROOT = path.resolve(import.meta.dirname, '..');
const ASSETS = path.join(ROOT, 'static/assets/guides');

async function login(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.locator('#email').fill(EMAIL);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('main.auth .btn-primary').click();
  await page.waitForURL('**/recipes');
}

async function shot(page, rel) {
  const dest = path.join(ASSETS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await page.screenshot({ path: dest, fullPage: true });
  console.log('wrote', rel);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await login(page);
await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
await page.waitForURL('**/shopping-list');
await shot(page, 'clear-all-shopping-list/step-1-shopping-list.png');
await shot(page, 'clear-all-shopping-list/step-2-clear-all-visible.png');
await page.getByRole('button', { name: 'Clear all' }).click();
await shot(page, 'clear-all-shopping-list/step-3-empty.png');

await page.goto(BASE);
await login(page);
await shot(page, 'search-recipes-by-name/step-1-recipe-book.png');
await shot(page, 'search-recipes-by-name/step-2-search-field.png');
await page.locator('input.search').fill('carbonara');
await shot(page, 'search-recipes-by-name/step-3-filtered.png');
await page.locator('input.search').fill('');
await shot(page, 'search-recipes-by-name/step-4-cleared-search.png');

await page.getByRole('button', { name: /Spaghetti carbonara/i }).click();
await shot(page, 'adjust-recipe-servings/step-1-details.png');
await shot(page, 'adjust-recipe-servings/step-2-stepper.png');
await page.locator('.stepper button', { hasText: '+' }).click();
await shot(page, 'adjust-recipe-servings/step-3-scaled-amounts.png');
await page.getByRole('button', { name: 'Add to shopping list' }).click();
await page.waitForURL('**/shopping-list');
await shot(page, 'adjust-recipe-servings/step-4-shopping-list.png');

await page.goto(BASE);
await login(page);
await shot(page, 'add-new-recipe/step-1-recipe-book.png');
await page.locator('a.new-btn').click();
await page.waitForURL('**/recipes/new');
await shot(page, 'add-new-recipe/step-2-form.png');
await page.locator('#recipe-name').fill('Tomato soup');
await page.locator('#recipe-description').fill('Comfort food');
await page.locator('#recipe-time').fill('30 min');
await page.locator('#recipe-serves').fill('4');
await page.locator('#recipe-ingredients').fill('Tomatoes, 6\nOnion, 1');
await shot(page, 'add-new-recipe/step-3-form-filled.png');
await page.locator('form button[type="submit"]').click();
await shot(page, 'new-recipe-flow/step-2-shopping-list.png');
await page.getByRole('button', { name: 'Skip' }).click();
await shot(page, 'new-recipe-flow/step-3-rate.png');
await page.getByRole('button', { name: 'Skip' }).click();
await shot(page, 'new-recipe-flow/step-4-share.png');

await browser.close();