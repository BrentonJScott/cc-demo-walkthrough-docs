#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || 'demo@example.com';
const PASSWORD = process.env.PASSWORD || 'demo';
const ROOT = path.resolve(import.meta.dirname, '..');
const GUIDE = 'add-new-recipe';

async function login(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.locator('main.auth').getByRole('link', { name: 'Log in' }).click();
  await page.waitForURL('**/recipes');
}

async function shot(page, name) {
  const file = path.join(ROOT, `static/assets/guides/${GUIDE}/${name}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, fullPage: true });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.getByLabel('Email').fill(EMAIL);
await page.getByLabel('Password').fill(PASSWORD);
await shot(page, 'step-1-login');
await login(page);

await page.getByRole('button', { name: 'New recipe' }).click();
await shot(page, 'step-2-new-recipe-form');

const recipeName = 'Weeknight lentil stew';
await page.locator('#recipe-name').fill(recipeName);
await page.locator('#recipe-description').fill('A hearty vegetarian stew');
await page.locator('#recipe-time').fill('45 min');
await page.locator('#recipe-serves').fill('4');
await page.locator('#recipe-ingredients').fill(
  'Red lentils, 200 g\nOnion, 1\nCarrots, 2\nVegetable stock, 1 L',
);
await shot(page, 'step-3-form-filled');

await page.getByRole('button', { name: 'Save recipe' }).click();
await page.getByRole('button', { name: recipeName }).waitFor({ state: 'visible' });
await shot(page, 'step-4-saved-in-list');

await browser.close();
console.log('add-new-recipe screenshots captured');