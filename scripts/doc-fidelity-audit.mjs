#!/usr/bin/env node
/**
 * Per-step doc fidelity: visible labels/copy only (not aria-label unless doc cites tooltips/icons).
 */
import { chromium } from 'playwright';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || 'demo@example.com';
const PASSWORD = process.env.PASSWORD || 'demo';

/** @typedef {{ guide: string, step: string, expected: string, actual: string, pass: boolean }} Mismatch */

/** @type {Mismatch[]} */
const mismatches = [];
/** @type {Map<string, { functional: boolean, steps: { step: string, ok: boolean, note: string }[] }>} */
const guides = new Map();

function guideKey(file) {
  if (!guides.has(file)) guides.set(file, { functional: true, steps: [] });
  return guides.get(file);
}

function noteMismatch(guide, step, expected, actual) {
  mismatches.push({ guide, step, expected, actual, pass: false });
}

function recordStep(guide, step, ok, note) {
  const g = guideKey(guide);
  g.steps.push({ step, ok, note });
  if (!ok) g.functional = false;
}

/** Visible text in element subtree (excludes aria-only names). */
async function visibleText(locator) {
  return (await locator.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
}

async function hasVisibleLabel(page, forId) {
  const label = page.locator(`label[for="${forId}"]`);
  return label.isVisible().catch(() => false);
}

async function login(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.locator('#email').fill(EMAIL);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('main.auth .btn-primary').click();
  await page.waitForURL('**/recipes');
}

async function auditLoginStep(page, G, stepId) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const h1 = await visibleText(page.locator('main.auth h1'));
  recordStep(G, `${stepId} — Log in page title`, h1 === 'Log in', `h1: "${h1}"`);
  if (h1 !== 'Log in') noteMismatch(G, stepId, 'visible heading "Log in"', `h1 shows "${h1}"`);

  const emailLabel = await hasVisibleLabel(page, 'email');
  const pwLabel = await hasVisibleLabel(page, 'password');
  if (!emailLabel) noteMismatch(G, stepId, 'visible label "Email"', 'no visible label for #email');
  if (!pwLabel) noteMismatch(G, stepId, 'visible label "Password"', 'no visible label for #password');
  recordStep(G, `${stepId} — Email/Password labels`, emailLabel && pwLabel, 'Email and Password labels visible');

  const loginBtn = await visibleText(page.locator('main.auth .btn-primary'));
  recordStep(G, `${stepId} — Log in control`, loginBtn === 'Log in', `control text: "${loginBtn}"`);
  if (loginBtn !== 'Log in') noteMismatch(G, stepId, 'blue "Log in" in form card', `"${loginBtn}"`);

  await page.locator('#email').fill(EMAIL);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('main.auth .btn-primary').click();
  await page.waitForURL('**/recipes');
}

/** Section labels render uppercase via CSS; compare to doc with this normalizer. */
function normSection(text) {
  return text.replace(/\s+/g, ' ').trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

async function auditAddToShoppingList(page) {
  const G = 'add-to-shopping-list.md';
  await auditLoginStep(page, G, 'Step 1');

  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
  await page.waitForURL('**/shopping-list');

  const title = await visibleText(page.locator('h1'));
  const addSection = await visibleText(page.locator('section').first().locator('.section-label'));
  recordStep(G, 'Step 2 — Shopping list nav', title === 'Shopping list', `title: ${title}`);
  if (title !== 'Shopping list') noteMismatch(G, 'Step 2', 'title "Shopping list"', `"${title}"`);
  recordStep(G, 'Step 2 — ADD ITEM section', addSection === 'ADD ITEM', `section: "${addSection}"`);
  if (addSection !== 'ADD ITEM') noteMismatch(G, 'Step 2', 'heading "ADD ITEM"', `visible "${addSection}"`);

  const ingLabel = await visibleText(page.locator('label[for="item-name"]'));
  const ingPh = await page.locator('#item-name').getAttribute('placeholder');
  recordStep(G, 'Step 3 — Ingredient field', ingLabel === 'Ingredient', `label: ${ingLabel}`);
  if (ingLabel !== 'Ingredient') noteMismatch(G, 'Step 3', 'visible label "Ingredient"', `"${ingLabel}"`);
  if (ingPh !== 'e.g. Tomatoes')
    noteMismatch(G, 'Step 3', 'placeholder e.g. Tomatoes', `placeholder "${ingPh}"`);

  const amtLabel = await visibleText(page.locator('label[for="item-amount"]'));
  recordStep(G, 'Step 4 — Amount field', amtLabel === 'Amount', `label: ${amtLabel}`);
  if (amtLabel !== 'Amount') noteMismatch(G, 'Step 4', 'visible label "Amount"', `"${amtLabel}"`);

  const addBtn = await visibleText(page.locator('form.form button[type="submit"]'));
  const clearBtn = await visibleText(page.locator('form.form button[type="button"]'));
  recordStep(G, 'Step 5 — Add item button', addBtn === 'Add item', addBtn);
  if (addBtn !== 'Add item') noteMismatch(G, 'Step 5', 'button "Add item"', `"${addBtn}"`);
  if (clearBtn !== 'Clear') noteMismatch(G, 'Step 5 (Clear tip)', 'button "Clear"', `"${clearBtn}"`);

  const itemsLabel = await visibleText(page.locator('section').nth(1).locator('.section-label'));
  if (itemsLabel !== 'ITEMS') noteMismatch(G, 'Step 5 success', 'section "ITEMS"', `"${itemsLabel}"`);
}

async function auditEditShoppingList(page) {
  const G = 'edit-shopping-list.md';
  await login(page);
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
    await page.waitForURL('**/shopping-list');
    await page.locator('button[title="Edit"]').first().waitFor({ state: 'visible' });

    const row = page.locator('.row').first();
  const editBtn = row.locator('button[title="Edit"]');
  const removeBtn = row.locator('button[title="Remove"]');
  const hasEditIcon = (await editBtn.count()) > 0;
  const hasRemoveIcon = (await removeBtn.count()) > 0;
  recordStep(G, 'Step 1 — Edit icon + tooltip', hasEditIcon, 'pencil with title="Edit"');
  recordStep(G, 'Step 1 — Remove icon + tooltip', hasRemoveIcon, 'trash with title="Remove"');
  if (!hasEditIcon) noteMismatch(G, 'Step 1', 'pencil Edit icon (tooltip Edit)', 'control missing');
  if (!hasRemoveIcon) noteMismatch(G, 'Step 1', 'trash Remove icon (tooltip Remove)', 'control missing');

  await editBtn.click();
  const cancelText = await visibleText(page.locator('.row button', { hasText: 'Cancel' }));
  const saveText = await visibleText(page.locator('.row button[type="submit"]'));
  recordStep(G, 'Step 2 — Cancel/Save', cancelText === 'Cancel' && saveText === 'Save', `${cancelText} / ${saveText}`);
  if (cancelText !== 'Cancel') noteMismatch(G, 'Step 2', 'visible "Cancel"', `"${cancelText}"`);
  if (saveText !== 'Save') noteMismatch(G, 'Step 2', 'visible "Save"', `"${saveText}"`);

  const editInputs = await page.locator('.row input').count();
  recordStep(G, 'Step 2 — two inline text fields', editInputs >= 2, `${editInputs} inputs in edit row`);
  if (editInputs < 2) noteMismatch(G, 'Step 2', 'two text fields for name and amount', `${editInputs} inputs`);
}

async function auditRemove(page) {
  const G = 'remove-from-shopping-list.md';
  await login(page);
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
  await page.waitForURL('**/shopping-list');
  await page.locator('button[title="Remove"]').first().waitFor({ state: 'visible' });

  const removeBtn = page.locator('.row').first().locator('button[title="Remove"]');
  const hasRemove = (await removeBtn.count()) > 0;
  recordStep(G, 'Step 2 — Remove icon', hasRemove, 'trash with title="Remove"');
  if (!hasRemove) noteMismatch(G, 'Step 2', 'trash Remove icon', 'control missing');

  const itemsSection = await visibleText(page.locator('section .section-label', { hasText: 'Items' }));
  recordStep(G, 'Step 1 — ITEMS section', itemsSection === 'ITEMS', itemsSection);
}

async function auditAddRecipe(page) {
  const G = 'add-recipe-to-shopping-list.md';
  await auditLoginStep(page, G, 'Step 1');

  await page.getByRole('button', { name: /Spaghetti carbonara/i }).click();
  const allRecipes = await visibleText(page.locator('.section-label', { hasText: 'All recipes' }).first());
  const details = await visibleText(page.locator('.section-label', { hasText: 'Details' }).first());
  recordStep(
    G,
    'Step 2 — ALL RECIPES / DETAILS',
    allRecipes === 'ALL RECIPES' && details === 'DETAILS',
    `${allRecipes} / ${details}`,
  );
  if (allRecipes !== 'ALL RECIPES') noteMismatch(G, 'Step 2', 'visible "ALL RECIPES"', `"${allRecipes}"`);

  const ingSection = await visibleText(page.locator('.details .section-label', { hasText: 'Ingredients' }));
  recordStep(G, 'Step 3 — Ingredients', normSection(ingSection) === 'Ingredients', ingSection);
  if (normSection(ingSection) !== 'Ingredients')
    noteMismatch(G, 'Step 3', '"Ingredients" in Details', `visible "${ingSection}"`);

  const addBtn = await visibleText(page.locator('.details .btn-primary'));
  recordStep(G, 'Step 4 — Add to shopping list', addBtn === 'Add to shopping list', addBtn);
  if (addBtn !== 'Add to shopping list') noteMismatch(G, 'Step 4', 'button "Add to shopping list"', `"${addBtn}"`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
try {
  await auditAddRecipe(page);
  await auditAddToShoppingList(page);
  await auditEditShoppingList(page);
  await auditRemove(page);
} finally {
  await browser.close();
}

const result = { mismatches, guides: Object.fromEntries(guides) };
console.log(JSON.stringify(result, null, 2));
process.exit(mismatches.length ? 2 : 0);