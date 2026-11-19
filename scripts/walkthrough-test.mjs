#!/usr/bin/env node
/**
 * Headless Playwright walkthrough for each guide matching DOCUMENTED_FEATURES.MD.
 * Run: node scripts/walkthrough-test.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || 'demo@example.com';
const PASSWORD = process.env.PASSWORD || 'demo';
const ROOT = path.resolve(import.meta.dirname, '..');

/** @type {{ guide: string, step: string, status: 'pass'|'drift'|'fail', detail: string }[]} */
const reports = [];

function record(guide, step, status, detail) {
  reports.push({ guide, step, status, detail });
}

async function login(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.locator('main.auth').getByRole('link', { name: 'Log in' }).click();
  await page.waitForURL('**/recipes');
  record('All guides (login)', 'Enter Email/Password; Log in in form card', 'pass', 'Landed on Recipes');
}

async function testAddRecipe(page) {
  const guide = 'add-recipe-to-shopping-list.md';
  await login(page);
  record(guide, '1 — Log in', 'pass', 'Recipes visible');
  await page.getByRole('button', { name: /Spaghetti carbonara/i }).click();
  const ing = await page.locator('.details ul li', { hasText: 'Spaghetti' }).first().isVisible();
  record(guide, '2–3 — Select recipe; Ingredients in Details', ing ? 'pass' : 'fail', 'Spaghetti in ingredients list');
  await page.getByRole('button', { name: 'Add to shopping list' }).click();
  await page.waitForURL('**/shopping-list');
  record(guide, '4 — Add to shopping list', 'pass', 'Navigated to Shopping list');
  const texts = await page.locator('.row .item-name').allTextContents();
  const need = ['Spaghetti', 'Guanciale', 'Eggs', 'Pecorino Romano', 'Black pepper'];
  const missing = need.filter((n) => !texts.some((t) => t.includes(n)));
  record(
    guide,
    '5 — Items shows recipe ingredients',
    missing.length ? 'fail' : 'pass',
    missing.length ? `Missing: ${missing.join(', ')}` : 'All carbonara ingredients present',
  );
  if (texts.length > need.length + 3) {
    record(
      guide,
      '(context) pre-seeded items',
      'pass',
      'Demo seeds default rows; guide notes recipe ingredients append to existing Items',
    );
  }
}

async function testAddToList(page) {
  const guide = 'add-to-shopping-list.md';
  await login(page);
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
  await page.waitForURL('**/shopping-list');
  record(guide, '2 — Shopping list tab', 'pass', 'Add item form visible');
  const seeded = await page.locator('.row').count();
  if (seeded > 0) {
    record(guide, '(context) default Items', 'drift', `Demo starts with ${seeded} seeded rows (note in guide covers this)`);
  }
  const unique = `Audit-${Date.now()}`;
  await page.locator('#item-name').fill(unique);
  await page.locator('#item-amount').fill('3 kg');
  record(guide, '3–4 — Ingredient and Amount', 'pass', `Filled ${unique}`);
  await page.locator('form.form button[type="submit"]').click();
  await page.locator('.row', { hasText: unique }).waitFor({ state: 'visible' });
  const nameEmpty = (await page.locator('#item-name').inputValue()) === '';
  record(guide, '5 — Add item', nameEmpty ? 'pass' : 'drift', nameEmpty ? 'Row added; fields cleared' : 'Fields not cleared');
}

async function testEditList(page) {
  const guide = 'edit-shopping-list.md';
  await login(page);
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
  await page.waitForURL('**/shopping-list');
  const target = page.locator('.row').first();
  const original = await target.locator('.item-name').textContent();
  await target.getByRole('button', { name: 'Edit' }).click();
  const nameBox = target.getByRole('textbox', { name: 'Ingredient name' });
  await nameBox.waitFor({ state: 'visible' });
  record(guide, '3 — Edit opens inline fields', 'pass', 'Ingredient name and Amount inputs visible');
  const edited = `${original?.trim()} (e2e)`;
  await nameBox.fill(edited);
  await target.getByRole('button', { name: 'Save' }).click();
  await page.locator('.row', { hasText: edited }).waitFor({ state: 'visible' });
  record(guide, '4 — Save', 'pass', `Row shows ${edited}`);
}

async function testAddNewRecipe(page) {
  const guide = 'add-new-recipe.md';
  await login(page);
  record(guide, '1 — Log in', 'pass', 'Recipes visible');
  const before = await page.getByRole('button', { name: /New recipe/i }).isVisible();
  record(guide, '2 — New recipe control', before ? 'pass' : 'fail', before ? 'New recipe button visible' : 'Missing New recipe');
  await page.getByRole('button', { name: 'New recipe' }).click();
  const formVisible = await page.getByLabel('Name', { exact: true }).isVisible();
  record(guide, '3–5 — New recipe form', formVisible ? 'pass' : 'fail', formVisible ? 'Form fields shown' : 'Form not open');
  const unique = `E2E Soup ${Date.now()}`;
  await page.locator('#recipe-name').fill(unique);
  await page.locator('#recipe-description').fill('Automated walkthrough recipe');
  await page.locator('#recipe-time').fill('20 min');
  await page.locator('#recipe-serves').fill('2');
  await page
    .locator('#recipe-ingredients')
    .fill('Carrots, 3\nCelery, 2 stalks\nBroth, 1 L');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  const inList = await page.getByRole('button', { name: new RegExp(unique) }).isVisible();
  record(guide, '6 — Save recipe', inList ? 'pass' : 'fail', inList ? 'Recipe appears in All recipes' : 'Recipe not listed');
  const detailTitle = await page.locator('.details h2').textContent();
  const detailMatch = detailTitle?.includes(unique);
  record(
    guide,
    '6 — Details panel',
    detailMatch ? 'pass' : 'fail',
    detailMatch ? 'Details shows saved recipe' : `Details title: ${detailTitle}`,
  );
  const ingCount = await page.locator('.details ul li').count();
  record(
    guide,
    '(context) ingredient lines',
    ingCount >= 3 ? 'pass' : 'fail',
    ingCount >= 3 ? `${ingCount} ingredients in Details` : `Expected 3+ ingredients, saw ${ingCount}`,
  );
}

async function testRemove(page) {
  const guide = 'remove-from-shopping-list.md';
  await login(page);
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
  await page.waitForURL('**/shopping-list');
  record(guide, '1 — Open Shopping list', 'pass', 'Items section visible');
  const initial = await page.locator('.row').count();
  if (initial === 0) {
    await page.locator('#item-name').fill('Remove-me');
    await page.locator('form.form button[type="submit"]').click();
    await page.locator('.row', { hasText: 'Remove-me' }).waitFor();
  }
  const firstName = await page.locator('.row').first().locator('.item-name').textContent();
  await page.locator('.row').first().getByRole('button', { name: 'Remove' }).click();
  const stillThere = await page.locator('.row', { hasText: firstName?.trim() ?? '' }).count();
  record(
    guide,
    '2 — Remove row',
    stillThere === 0 ? 'pass' : 'fail',
    stillThere === 0 ? `Removed "${firstName?.trim()}"` : 'Row still present',
  );
  while ((await page.locator('.row').count()) > 0) {
    await page.locator('.row').first().getByRole('button', { name: 'Remove' }).click();
  }
  const empty = await page.getByText('Your shopping list is empty.').isVisible();
  record(guide, '3 — Empty state (optional)', empty ? 'pass' : 'fail', empty ? 'Empty message shown' : 'No empty message');
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
try {
  await testAddRecipe(page);
  await testAddToList(page);
  await testEditList(page);
  await testAddNewRecipe(page);
  await testRemove(page);
} finally {
  await browser.close();
}

const date = new Date().toISOString().slice(0, 10);
const outJson = path.join(ROOT, `docs/reports/${date}-playwright-walkthrough.json`);
const outMd = path.join(ROOT, `docs/reports/${date}-playwright-walkthrough.md`);

const byGuide = new Map();
for (const r of reports) {
  if (!byGuide.has(r.guide)) byGuide.set(r.guide, []);
  byGuide.get(r.guide).push(r);
}

let md = `# Playwright walkthrough report (${date})\n\n`;
md += `Target: ${BASE}\n\n`;
for (const [guide, rows] of byGuide) {
  md += `## ${guide}\n\n`;
  md += `| Step | Status | Detail |\n|---|---|---|\n`;
  for (const r of rows) {
    md += `| ${r.step} | ${r.status} | ${r.detail.replace(/\|/g, '\\|')} |\n`;
  }
  md += '\n';
}

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(reports, null, 2));
fs.writeFileSync(outMd, md);
console.log(md);
console.log(`Wrote ${outMd}`);

const failed = reports.filter((r) => r.status === 'fail');
process.exit(failed.length ? 1 : 0);