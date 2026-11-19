#!/usr/bin/env node
/**
 * Headless Playwright checks for DOCUMENTED_FEATURES.MD guides.
 * Usage (from repo root): node scripts/walkthrough-test.mjs
 * Requires: npm install playwright in a parent or sibling folder, or run from /tmp with playwright installed.
 */
import { chromium } from 'playwright';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || 'demo@example.com';
const PASSWORD = process.env.PASSWORD || 'demo';

const reports = [];

function log(feature, step, status, detail) {
  reports.push({ feature, step, status, detail });
}

async function login(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.locator('main').getByRole('link', { name: 'Log in' }).click();
  await page.waitForURL('**/recipes');
}

async function testAddRecipeItems() {
  const feature = 'Add recipe items to shopping list';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await login(page);
    log(feature, 1, 'pass', 'Recipes page after login');
    await page.getByRole('button', { name: /Spaghetti carbonara/i }).click();
    const ingVisible = await page.locator('.details ul li', { hasText: 'Spaghetti' }).first().isVisible();
    log(feature, 3, ingVisible ? 'pass' : 'fail', 'Ingredients in Details');
    await page.getByRole('button', { name: 'Add to shopping list' }).click();
    await page.waitForURL('**/shopping-list');
    const texts = await page.locator('.row .item-name').allTextContents();
    const recipeNames = ['Spaghetti', 'Guanciale', 'Eggs', 'Pecorino Romano', 'Black pepper'];
    const missing = recipeNames.filter((n) => !texts.some((t) => t.includes(n)));
    log(feature, 5, missing.length === 0 ? 'pass' : 'fail', `Missing ingredients: ${missing.join(', ') || 'none'}`);
  } catch (e) {
    log(feature, 'error', 'fail', String(e));
  } finally {
    await browser.close();
  }
}

async function testAddToShoppingList() {
  const feature = 'Add to Shopping list';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await login(page);
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
    const unique = `AuditIngredient-${Date.now()}`;
    await page.locator('#item-name').fill(unique);
    await page.locator('#item-amount').fill('3 kg');
    await page.locator('form.form button[type="submit"]').click();
    await page.locator('.row', { hasText: unique }).waitFor({ state: 'visible' });
    log(feature, 5, 'pass', `Added ${unique}`);
  } catch (e) {
    log(feature, 'error', 'fail', String(e));
  } finally {
    await browser.close();
  }
}

async function testRemoveFromShoppingList() {
  const feature = 'Remove from shopping list';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await login(page);
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
    if ((await page.locator('.row').count()) === 0) {
      await page.locator('#item-name').fill('Remove-me');
      await page.locator('form.form button[type="submit"]').click();
    }
    while ((await page.locator('.row').count()) > 0) {
      await page.locator('.row').first().getByRole('button', { name: 'Remove' }).click();
    }
    const empty = await page.getByText('Your shopping list is empty.').isVisible();
    log(feature, 5, empty ? 'pass' : 'fail', empty ? 'Empty state' : 'No empty message');
  } catch (e) {
    log(feature, 'error', 'fail', String(e));
  } finally {
    await browser.close();
  }
}

await testAddRecipeItems();
await testAddToShoppingList();
await testRemoveFromShoppingList();

console.log(JSON.stringify(reports, null, 2));