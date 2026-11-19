#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || 'demo@example.com';
const PASSWORD = process.env.PASSWORD || 'demo';
const ROOT = path.resolve(import.meta.dirname, '..');

async function login(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.locator('main.auth').getByRole('link', { name: 'Log in' }).click();
  await page.waitForURL('**/recipes');
}

async function shot(page, rel) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, fullPage: true });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// add-recipe step 1 (login) — capture before login
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.getByLabel('Email').fill(EMAIL);
await page.getByLabel('Password').fill(PASSWORD);
await shot(page, 'static/assets/guides/add-recipe-to-shopping-list/step-1-login.png');
await login(page);
await shot(page, 'static/assets/guides/add-recipe-to-shopping-list/step-2-recipes.png');
await page.getByRole('button', { name: /Spaghetti carbonara/i }).click();
await shot(page, 'static/assets/guides/add-recipe-to-shopping-list/step-3-details.png');
await page.getByRole('button', { name: 'Add to shopping list' }).click();
await page.waitForURL('**/shopping-list');
await shot(page, 'static/assets/guides/add-recipe-to-shopping-list/step-4-ingredients-on-list.png');

// edit shopping list screenshots
await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
await shot(page, 'static/assets/guides/edit-shopping-list/step-1-items.png');
const row = page.locator('.row').first();
await row.getByRole('button', { name: 'Edit' }).click();
await shot(page, 'static/assets/guides/edit-shopping-list/step-2-edit-fields.png');
const nameInput = page.getByRole('textbox', { name: 'Ingredient name' });
await nameInput.fill('Tomatoes (edited)');
await page.locator('form.row input[aria-label="Amount"]').fill('8');
await shot(page, 'static/assets/guides/edit-shopping-list/step-3-edit-filled.png');
await page.getByRole('button', { name: 'Save' }).click();
await shot(page, 'static/assets/guides/edit-shopping-list/step-4-after-save.png');

await browser.close();
console.log('Screenshots captured');