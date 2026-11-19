#!/usr/bin/env node
/**
 * Cron audit: all rows in demo-angular-22 DOCUMENTED_FEATURES.MD (one guide per feature).
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || 'demo@example.com';
const PASSWORD = process.env.PASSWORD || 'demo';

/** @typedef {{ feature: string, guide: string|null, functional: 'pass'|'fail', doc_fidelity: 'pass'|'drift'|'fail', mismatches: { step: string, doc: string, screen: string }[], functional_notes: string[] }} GuideReport */

/** @type {GuideReport[]} */
const reports = [];

function pushMismatch(report, step, doc, screen) {
  report.mismatches.push({ step, doc, screen });
}

async function visibleText(locator) {
  return (await locator.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
}

async function login(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.locator('#email').fill(EMAIL);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('main.auth .btn-primary').click();
  await page.waitForURL('**/recipes');
}

async function openShoppingList(page) {
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
  await page.waitForURL('**/shopping-list');
}

// --- Feature: Add to Shopping list ---
async function auditAddToShoppingList(page) {
  const report = {
    feature: 'Add to Shopping list',
    guide: 'add-to-shopping-list.md',
    functional: 'pass',
    doc_fidelity: 'pass',
    mismatches: [],
    functional_notes: [],
  };
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const loginH1 = await visibleText(page.locator('main.auth h1'));
  if (loginH1 !== 'Log in') {
    pushMismatch(report, 'Step 1', 'page title / heading "Log in"', `h1 "${loginH1}"`);
    report.doc_fidelity = 'drift';
  }
  await page.locator('#email').fill(EMAIL);
  await page.locator('#password').fill(PASSWORD);
  const loginCtrl = await visibleText(page.locator('main.auth .btn-primary'));
  if (loginCtrl !== 'Log in') {
    pushMismatch(report, 'Step 1', 'blue "Log in" link inside white card', `"${loginCtrl}"`);
    report.doc_fidelity = 'drift';
  }
  await page.locator('main.auth .btn-primary').click();
  await page.waitForURL('**/recipes');
  const recipesTitle = await visibleText(page.locator('h1').first());
  if (recipesTitle !== 'Recipes') {
    pushMismatch(
      report,
      'Step 1',
      'land on the **Recipes** page',
      `h1 shows "${recipesTitle}"`,
    );
    report.doc_fidelity = 'drift';
  }

  await openShoppingList(page);
  const slTitle = await visibleText(page.locator('h1'));
  const addSection = await visibleText(page.locator('section').first().locator('.section-label'));
  if (slTitle !== 'Shopping list') {
    pushMismatch(report, 'Step 2', 'title **Shopping list**', `"${slTitle}"`);
    report.doc_fidelity = 'drift';
  }
  if (addSection !== 'ADD ITEM') {
    pushMismatch(report, 'Step 2', 'small caps heading **ADD ITEM**', `"${addSection}"`);
    report.doc_fidelity = 'drift';
  }

  const ingLabel = await visibleText(page.locator('label[for="item-name"]'));
  const ingPh = await page.locator('#item-name').getAttribute('placeholder');
  if (ingLabel !== 'Ingredient') pushMismatch(report, 'Step 3', '**Ingredient** field', `label "${ingLabel}"`);
  if (ingPh !== 'e.g. Tomatoes') pushMismatch(report, 'Step 3', 'placeholder *e.g. Tomatoes*', `"${ingPh}"`);

  const amtLabel = await visibleText(page.locator('label[for="item-amount"]'));
  if (amtLabel !== 'Amount') pushMismatch(report, 'Step 4', '**Amount** field', `label "${amtLabel}"`);

  const unique = `Cron-${Date.now()}`;
  await page.locator('#item-name').fill(unique);
  await page.locator('#item-amount').fill('6');
  const addBtn = await visibleText(page.locator('form.form button[type="submit"]'));
  if (addBtn !== 'Add item') pushMismatch(report, 'Step 5', 'blue **Add item** button', `"${addBtn}"`);
  await page.locator('form.form button[type="submit"]').click();
  const added = await page.locator('.row', { hasText: unique }).isVisible();
  if (!added) {
    report.functional = 'fail';
    report.functional_notes.push('Add item did not create row');
  }
  if (report.mismatches.length) report.doc_fidelity = 'drift';
  reports.push(report);
}

// --- Remove ---
async function auditRemove(page) {
  const report = {
    feature: 'Remove from shopping list',
    guide: 'remove-from-shopping-list.md',
    functional: 'pass',
    doc_fidelity: 'pass',
    mismatches: [],
    functional_notes: [],
  };
  await login(page);
  await openShoppingList(page);
  const itemsLabel = await visibleText(page.locator('section .section-label', { hasText: 'Items' }));
  if (itemsLabel !== 'ITEMS') {
    pushMismatch(report, 'Step 1', 'scroll to **ITEMS**', `section label "${itemsLabel}"`);
  }
  const unique = `Rm-${Date.now()}`;
  await page.locator('#item-name').fill(unique);
  await page.locator('form.form button[type="submit"]').click();
  await page.locator('.item-name', { hasText: unique }).waitFor();
  const removeCount = await page.locator('button[title="Remove"]').count();
  if (!removeCount) {
    pushMismatch(report, 'Step 2', 'trash **Remove** icon (tooltip **Remove**)', 'no button[title="Remove"]');
    report.functional = 'fail';
  } else {
    const row = page.locator('.row', { hasText: unique });
    await row.locator('button[title="Remove"]').click();
    await page.waitForTimeout(200);
    if (await page.locator('.item-name', { hasText: unique }).count()) {
      report.functional = 'fail';
      report.functional_notes.push('Remove did not delete row');
    }
  }
  if (report.mismatches.length) report.doc_fidelity = 'drift';
  reports.push(report);
}

// --- Clear all ---
async function auditClearAll(page) {
  const report = {
    feature: 'Clear all items from the shopping list',
    guide: null,
    functional: 'pass',
    doc_fidelity: 'fail',
    mismatches: [{ step: '(guide)', doc: 'Expected guide under docs/guides/', screen: 'No guide file on main' }],
    functional_notes: [],
  };
  await login(page);
  await openShoppingList(page);
  const clearAllVisible = await page.getByRole('button', { name: 'Clear all' }).isVisible().catch(() => false);
  if (!clearAllVisible) {
    report.functional = 'fail';
    report.functional_notes.push('Clear all button not visible with items on list');
  } else {
    await page.getByRole('button', { name: 'Clear all' }).click();
    await page.waitForTimeout(300);
    const rows = await page.locator('.row').count();
    const emptyMsg = await visibleText(page.locator('.empty'));
    if (rows > 0) {
      report.functional = 'fail';
      report.functional_notes.push(`Still ${rows} rows after Clear all`);
    } else if (!emptyMsg.includes('Your shopping list is empty')) {
      report.functional_notes.push(`Empty message: "${emptyMsg}"`);
    }
  }
  reports.push(report);
}

// --- Add recipe items ---
async function auditAddRecipe(page) {
  const report = {
    feature: 'Add recipe items to shopping list',
    guide: 'add-recipe-to-shopping-list.md',
    functional: 'pass',
    doc_fidelity: 'pass',
    mismatches: [],
    functional_notes: [],
  };
  await login(page);
  const recipesTitle = await visibleText(page.locator('h1').first());
  if (recipesTitle !== 'Recipes') {
    pushMismatch(report, 'Step 1', 'land on **Recipes**', `h1 "${recipesTitle}"`);
  }
  await page.getByRole('button', { name: /Spaghetti carbonara/i }).click();
  const allRecipes = await visibleText(page.locator('.section-label', { hasText: 'All recipes' }).first());
  if (allRecipes !== 'ALL RECIPES') pushMismatch(report, 'Step 2', '**ALL RECIPES**', `"${allRecipes}"`);
  const ingSection = await visibleText(page.locator('.details .section-label', { hasText: 'Ingredients' }));
  if (ingSection !== 'INGREDIENTS') pushMismatch(report, 'Step 3', '**INGREDIENTS** list', `"${ingSection}"`);
  const addBtn = await visibleText(page.locator('.details .btn-primary'));
  if (addBtn !== 'Add to shopping list') pushMismatch(report, 'Step 4', '**Add to shopping list**', `"${addBtn}"`);
  await page.getByRole('button', { name: 'Add to shopping list' }).click();
  await page.waitForURL('**/shopping-list');
  const texts = await page.locator('.row .item-name').allTextContents();
  const need = ['Spaghetti', 'Guanciale'];
  const missing = need.filter((n) => !texts.some((t) => t.includes(n)));
  if (missing.length) {
    report.functional = 'fail';
    report.functional_notes.push(`Missing ingredients: ${missing.join(', ')}`);
  }
  if (report.mismatches.length) report.doc_fidelity = 'drift';
  reports.push(report);
}

// --- Add new recipe ---
async function auditNewRecipe(page) {
  const report = {
    feature: 'Add a new recipe',
    guide: null,
    functional: 'pass',
    doc_fidelity: 'fail',
    mismatches: [{ step: '(guide)', doc: 'Guide for new recipe flow', screen: 'No guide on main (add-new-recipe.md removed)' }],
    functional_notes: [],
  };
  await login(page);
  const newBtn = page.getByRole('button', { name: 'New recipe' });
  const hasNew = await newBtn.isVisible().catch(() => false);
  if (!hasNew) {
    report.functional = 'fail';
    report.functional_notes.push('New recipe button not visible');
  } else {
    await newBtn.click();
    await page.waitForTimeout(300);
    const formVisible = await page.locator('#recipe-name').isVisible().catch(() => false);
    if (!formVisible) {
      report.functional = 'fail';
      report.functional_notes.push('Clicking New recipe did not open form');
    }
  }
  reports.push(report);
}

// --- Search ---
async function auditSearch(page) {
  const report = {
    feature: 'Search recipes by name',
    guide: null,
    functional: 'pass',
    doc_fidelity: 'fail',
    mismatches: [{ step: '(guide)', doc: 'search-recipes-by-name.md', screen: 'No guide file on main' }],
    functional_notes: [],
  };
  await login(page);
  const search = page.locator('input.search');
  const ph = await search.getAttribute('placeholder');
  if (ph !== 'Search recipes') {
    pushMismatch(report, '(expected doc)', 'placeholder Search recipes', `"${ph}"`);
  }
  await search.fill('zzznomatch123');
  await page.waitForTimeout(200);
  const visibleRecipes = await page.locator('.recipe strong').allTextContents();
  if (visibleRecipes.length > 0) {
    report.functional = 'fail';
    report.functional_notes.push(
      `Search term zzznomatch123 still shows ${visibleRecipes.length} recipes: ${visibleRecipes.slice(0, 3).join(', ')}`,
    );
  }
  await search.fill('carbonara');
  await page.waitForTimeout(200);
  const after = await page.locator('.recipe strong').allTextContents();
  const onlyCarbonara = after.length === 1 && /carbonara/i.test(after[0]);
  if (!onlyCarbonara) {
    report.functional = 'fail';
    report.functional_notes.push(`After "carbonara" filter, recipes shown: ${after.join(', ') || '(none)'}`);
  }
  reports.push(report);
}

// --- Adjust servings ---
async function auditServings(page) {
  const report = {
    feature: "Adjust a recipe's servings",
    guide: null,
    functional: 'pass',
    doc_fidelity: 'fail',
    mismatches: [{ step: '(guide)', doc: 'Guide for servings +/- and scaled shopping list', screen: 'No guide on main' }],
    functional_notes: [],
  };
  await login(page);
  await page.getByRole('button', { name: /Spaghetti carbonara/i }).click();
  const minus = page.locator('.stepper button').first();
  const plus = page.locator('.stepper button').last();
  const minusText = await visibleText(minus);
  const plusText = await visibleText(plus);
  if (minusText !== '−' && minusText !== '-') {
    pushMismatch(report, '(expected)', 'visible minus control', `"${minusText}"`);
  }
  if (plusText !== '+') {
    pushMismatch(report, '(expected)', 'visible plus control', `"${plusText}"`);
  }
  const amountBefore = await visibleText(page.locator('.details ul li').first().locator('.muted'));
  const servesBefore = await visibleText(page.locator('.step-value'));
  await plus.click();
  await page.waitForTimeout(150);
  const amountAfter = await visibleText(page.locator('.details ul li').first().locator('.muted'));
  const servesAfter = await visibleText(page.locator('.step-value'));
  if (servesAfter === servesBefore) {
    report.functional = 'fail';
    report.functional_notes.push('Servings did not increase after +');
  }
  if (amountBefore === amountAfter && servesBefore !== servesAfter) {
    report.functional = 'fail';
    report.functional_notes.push(`Amount did not scale: before "${amountBefore}" after "${amountAfter}"`);
  }
  await page.getByRole('button', { name: 'Add to shopping list' }).click();
  await page.waitForURL('**/shopping-list');
  const listAmount = await visibleText(page.locator('.row').first().locator('.muted'));
  if (listAmount === amountBefore && servesAfter !== servesBefore) {
    report.functional = 'fail';
    report.functional_notes.push('Shopping list got unscaled amounts');
  }
  reports.push(report);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
try {
  await auditAddToShoppingList(page);
  await auditRemove(page);
  await auditClearAll(page);
  await auditAddRecipe(page);
  await auditNewRecipe(page);
  await auditSearch(page);
  await auditServings(page);
} finally {
  await browser.close();
}

const out = path.join(import.meta.dirname, '..', 'reports', '2026-11-19-cron-feature-audit.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports, null, 2));