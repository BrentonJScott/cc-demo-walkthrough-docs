import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEMO_URL = process.env.DEMO_URL || 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || 'demo@example.com';
const PASSWORD = process.env.PASSWORD || 'demo-password';
const SCREENSHOTS = path.join(ROOT, 'docs/assets/screenshots/2026-11-19');

fs.mkdirSync(SCREENSHOTS, { recursive: true });

async function screenshot(page, name) {
  const file = path.join(SCREENSHOTS, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return `docs/assets/screenshots/2026-11-19/${name}.png`;
}

async function login(page) {
  await page.goto(DEMO_URL);
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.locator('main.auth').getByRole('link', { name: 'Log in' }).click();
  await page.getByRole('heading', { name: 'Recipes' }).waitFor();
}

const reports = [];

function record(doc, step, status, note) {
  if (!reports.find((r) => r.doc === doc)) {
    reports.push({ doc, steps: [] });
  }
  reports.find((r) => r.doc === doc).steps.push({ step, status, note });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  // --- Doc: add-recipe-to-shopping-list.md ---
  const docRecipe = 'add-recipe-to-shopping-list.md';
  await login(page);
  await screenshot(page, 'add-recipe-step-1-login');
  record(docRecipe, 1, 'pass', 'Filled Email/Password; clicked Log in link in form; Recipes page opened.');

  await page.getByRole('button', { name: 'Spaghetti carbonara' }).click();
  await screenshot(page, 'add-recipe-step-2-select-recipe');
  record(docRecipe, 2, 'pass', 'Clicked Spaghetti carbonara under All recipes.');

  const ingredients = page.locator('section').filter({ hasText: 'Details' }).getByText('Ingredients');
  await ingredients.waitFor();
  record(docRecipe, 3, 'pass', 'Ingredients visible under Details.');

  const beforeCount = await page.locator('.row .item-name').count().catch(() => 0);
  await page.getByRole('button', { name: 'Add to shopping list' }).click();
  await page.getByRole('heading', { name: 'Shopping list' }).waitFor();
  await screenshot(page, 'add-recipe-step-4-shopping-list');
  const afterNames = await page.locator('.row .item-name').allTextContents();
  record(
    docRecipe,
    4,
    'pass',
    `Shopping list opened. Doc implies only recipe ingredients; hosted app already had ${beforeCount} seeded items — list now has ${afterNames.length} items total.`,
  );
  record(
    docRecipe,
    0,
    'drift',
    'Step 1 calls Log in a "button"; on the login page it is a link inside the form (header also has a Log in tab on auth pages). Step 6 text suggests the list contains only the recipe ingredients; the demo seeds five items by default and add appends.',
  );

  // --- Doc: add-to-shopping-list.md (to be created) ---
  const docAdd = 'add-to-shopping-list.md';
  await page.goto(DEMO_URL);
  await login(page);
  await page.getByRole('link', { name: 'Shopping list', exact: true }).click();
  await page.getByRole('heading', { name: 'Shopping list' }).waitFor();
  await screenshot(page, 'add-item-step-1-shopping-list');

  const itemName = 'Walkthrough lemons';
  const itemAmount = '3';
  await page.getByLabel('Ingredient').fill(itemName);
  await page.getByLabel('Amount').fill(itemAmount);
  await screenshot(page, 'add-item-step-2-filled-form');
  await page.getByRole('button', { name: 'Add item' }).click();
  await page.getByText(itemName).waitFor();
  await screenshot(page, 'add-item-step-3-item-added');
  record(docAdd, 1, 'pass', 'Logged in and opened Shopping list tab.');
  record(docAdd, 2, 'pass', 'Filled Ingredient and Amount fields.');
  record(docAdd, 3, 'pass', 'Clicked Add item; new row appeared.');
  record(docAdd, 0, 'drift', 'List is not empty on first visit — five demo items appear before you add anything.');

  // --- Doc: remove-from-shopping-list.md (to be created) ---
  const docRemove = 'remove-from-shopping-list.md';
  const removeTarget = itemName;
  const row = page.locator('.row').filter({ hasText: removeTarget });
  await screenshot(page, 'remove-item-step-1-before');
  const countBefore = await page.locator('.row').count();
  await row.getByRole('button', { name: 'Remove' }).click();
  await page.waitForTimeout(300);
  await screenshot(page, 'remove-item-step-2-after');
  const countAfter = await page.locator('.row').count();
  const stillThere = (await page.getByText(removeTarget).count()) > 0;
  record(docRemove, 1, 'pass', 'On Shopping list with items visible.');
  record(docRemove, 2, 'pass', `Clicked Remove on "${removeTarget}".`);
  record(
    docRemove,
    3,
    stillThere ? 'fail' : 'pass',
    stillThere ? 'Item still visible after Remove.' : `Row count ${countBefore} → ${countAfter}.`,
  );

  // --- Existing doc re-test from recipes page flow for add manual feature naming ---
  record(
    'DOCUMENTED_FEATURES mapping',
    0,
    'info',
    'Three features in DOCUMENTED_FEATURES.MD; one guide existed before this run.',
  );
} finally {
  await browser.close();
}

const reportPath = path.join(ROOT, 'docs/reports/2026-11-19-playwright-walkthrough.md');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });

let md = `---
title: "Playwright walkthrough report (2026-11-19)"
description: "Step-by-step results for each feature guide against the hosted Recipe Book demo."
type: report
---

# Playwright walkthrough report

**Demo:** ${DEMO_URL}  
**Run:** 2026-11-19 (headless Chromium)

## Feature coverage

| DOCUMENTED_FEATURES.MD | Guide doc | Status |
|---|---|---|
| Add to Shopping list | \`docs/guides/add-to-shopping-list.md\` | Created in this PR (was missing) |
| Remove from shopping list | \`docs/guides/remove-from-shopping-list.md\` | Created in this PR (was missing) |
| Add recipe items to shopping list | \`docs/guides/add-recipe-to-shopping-list.md\` | Existed; tested below |

`;

for (const { doc, steps } of reports) {
  md += `## ${doc}\n\n`;
  const drift = steps.filter((s) => s.step === 0);
  for (const d of drift) {
    md += `**Drift / notes:** ${d.note}\n\n`;
  }
  md += `| Step | Result | Notes |\n|---|---|---|\n`;
  for (const s of steps.filter((x) => x.step > 0)) {
    md += `| ${s.step} | ${s.status} | ${s.note} |\n`;
  }
  md += '\n';
}

fs.writeFileSync(reportPath, md);
console.log('Report written to', reportPath);