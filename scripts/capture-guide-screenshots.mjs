#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || 'demo@example.com';
const PASSWORD = process.env.PASSWORD || 'demo';
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

// add-to-shopping-list
await page.goto(BASE, { waitUntil: 'networkidle' });
await shot(page, 'add-to-shopping-list/step-1-login.png');
await login(page);
await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
await page.waitForURL('**/shopping-list');
await page.locator('button[title="Edit"]').first().waitFor({ state: 'visible' });
await shot(page, 'add-to-shopping-list/step-2-shopping-list.png');
const snapItem = `Tomatoes-${Date.now()}`;
await page.locator('#item-name').fill(snapItem);
await shot(page, 'add-to-shopping-list/step-3-ingredient.png');
await page.locator('#item-amount').fill('6');
await shot(page, 'add-to-shopping-list/step-4-amount.png');
await page.locator('form.form button[type="submit"]').click();
await page.locator('.row', { hasText: snapItem }).first().waitFor();
await shot(page, 'add-to-shopping-list/step-5-added.png');

// edit-shopping-list
await page.goto(BASE);
await login(page);
await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
await page.locator('button[title="Edit"]').first().waitFor({ state: 'visible' });
await shot(page, 'edit-shopping-list/step-1-items.png');
await page.locator('.row').first().locator('button[title="Edit"]').click();
await shot(page, 'edit-shopping-list/step-2-edit-fields.png');
await page.locator('.row input').first().fill('Tomatoes (edited)');
await shot(page, 'edit-shopping-list/step-3-edit-filled.png');
await page.locator('.row button[type="submit"]').click();
await shot(page, 'edit-shopping-list/step-4-after-save.png');

// remove
await page.goto(BASE);
await login(page);
await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
await page.locator('button[title="Remove"]').first().waitFor({ state: 'visible' });
await shot(page, 'remove-from-shopping-list/step-1-items.png');
await page.locator('.row').first().locator('button[title="Remove"]').click();
await shot(page, 'remove-from-shopping-list/step-2-after-remove.png');

// add-recipe
await page.goto(BASE);
await shot(page, 'add-recipe-to-shopping-list/step-1-login.png');
await login(page);
await page.getByRole('button', { name: /Spaghetti carbonara/i }).click();
await shot(page, 'add-recipe-to-shopping-list/step-2-recipes.png');
await shot(page, 'add-recipe-to-shopping-list/step-3-details.png');
await page.getByRole('button', { name: 'Add to shopping list' }).click();
await page.waitForURL('**/shopping-list');
await shot(page, 'add-recipe-to-shopping-list/step-4-ingredients-on-list.png');

await browser.close();