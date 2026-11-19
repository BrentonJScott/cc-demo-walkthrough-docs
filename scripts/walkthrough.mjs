import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = process.env.DEMO_URL ?? 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const email = process.env.EMAIL ?? '';
const password = process.env.PASSWORD ?? '';

const report = {
  testedAt: new Date().toISOString(),
  baseUrl: BASE,
  guides: {},
};

async function login(page) {
  await page.goto(BASE);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.locator('main').getByRole('link', { name: 'Log in' }).click();
  await page.waitForURL('**/recipes');
}

async function screenshot(page, dir, name) {
  await mkdir(dir, { recursive: true });
  const path = join(dir, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  return path;
}

async function testAddRecipeToShoppingList(page, shotDir) {
  const steps = [];
  const drift = [];
  const name = 'add-recipe-to-shopping-list';

  try {
    steps.push('Navigate to demo and log in with Email, Password, Log in link');
    await login(page);
    if (!(await page.getByRole('heading', { name: 'Recipes' }).isVisible())) {
      drift.push('Step 1: Expected Recipes page heading after login');
    }

    steps.push('Click Spaghetti carbonara under All recipes');
    await page.getByText('Spaghetti carbonara', { exact: true }).first().click();
    await screenshot(page, shotDir, `${name}-step-3`);

    steps.push('Verify Ingredients in Details');
    const details = page.locator('section').filter({ hasText: 'Details' });
    if (!(await details.getByText('Ingredients').isVisible())) {
      drift.push('Step 3: Ingredients section not visible under Details');
    }

    steps.push('Click Add to shopping list');
    const countBefore = await page.locator('.row .item-name').count().catch(() => 0);
    await page.getByRole('button', { name: 'Add to shopping list' }).click();
    await page.waitForURL('**/shopping-list');

    steps.push('Shopping list shows recipe ingredients under Items');
    if (!(await page.getByRole('heading', { name: 'Shopping list' }).isVisible())) {
      drift.push('Step 4: Did not land on Shopping list page');
    }
    const countAfter = await page.locator('.row .item-name').count();
    if (countAfter <= countBefore) {
      drift.push(
        'Step 4: Item count did not increase (list may already contain recipe ingredients from defaults)',
      );
    }
    await screenshot(page, shotDir, `${name}-step-4`);
  } catch (e) {
    drift.push(`Failed: ${e.message}`);
  }

  report.guides[name] = { steps, drift, pass: drift.length === 0 };
}

async function captureAddToShoppingList(page, shotDir) {
  const steps = [];
  const drift = [];
  const name = 'add-to-shopping-list';
  const unique = `Walkthrough-${Date.now()}`;

  try {
    await page.goto(BASE);
    await screenshot(page, shotDir, `${name}-step-1-login`);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await screenshot(page, shotDir, `${name}-step-1-filled`);

    steps.push('Log in opens Recipes');
    await page.locator('main').getByRole('link', { name: 'Log in' }).click();
    await page.waitForURL('**/recipes');

    steps.push('Open Shopping list tab');
    await page.getByRole('link', { name: 'Shopping list' }).click();
    await page.waitForURL('**/shopping-list');
    await screenshot(page, shotDir, `${name}-step-2`);

    steps.push('Fill Ingredient and Amount, click Add item');
    await page.getByLabel('Ingredient').fill(unique);
    await page.getByLabel('Amount').fill('2 kg');
    await screenshot(page, shotDir, `${name}-step-3`);
    await page.getByRole('button', { name: 'Add item' }).click();

    if (!(await page.getByText(unique).isVisible())) {
      drift.push('New item not visible in Items list');
    }
    await screenshot(page, shotDir, `${name}-step-4`);
  } catch (e) {
    drift.push(`Failed: ${e.message}`);
  }

  report.guides[name] = { steps, drift, pass: drift.length === 0 };
}

async function captureEditShoppingList(page, shotDir) {
  const steps = [];
  const drift = [];
  const name = 'edit-shopping-list';
  const newName = `Edited-${Date.now()}`;
  const newAmount = '99 g';

  try {
    await login(page);
    await page.getByRole('link', { name: 'Shopping list' }).click();
    await page.waitForURL('**/shopping-list');
    await screenshot(page, shotDir, `${name}-step-2`);

    const firstRow = page.locator('.row').first();
    const original = (await firstRow.locator('.item-name').textContent())?.trim();
    if (!original) {
      drift.push('No items on list to edit');
    } else {
      steps.push(`Edit item: ${original}`);
      await firstRow.getByRole('button', { name: `Edit ${original}` }).click();
      await screenshot(page, shotDir, `${name}-step-3`);
      const editForm = page.locator('form').filter({ hasText: 'Cancel' });
      await editForm.getByLabel('Ingredient name').fill(newName);
      await editForm.getByLabel('Amount').fill(newAmount);
      await screenshot(page, shotDir, `${name}-step-3-filled`);
      await page.getByRole('button', { name: 'Save' }).click();
      if (!(await page.getByText(newName).isVisible())) {
        drift.push('Edited name not visible after Save');
      }
      if (await page.getByText(original, { exact: true }).isVisible()) {
        drift.push('Original name still visible after Save');
      }
      await screenshot(page, shotDir, `${name}-step-4`);
      steps.push('Saved inline edit');
    }
  } catch (e) {
    drift.push(`Failed: ${e.message}`);
  }

  report.guides[name] = { steps, drift, pass: drift.length === 0 };
}

async function captureRemoveFromShoppingList(page, shotDir) {
  const steps = [];
  const drift = [];
  const name = 'remove-from-shopping-list';

  try {
    await login(page);
    await page.getByRole('link', { name: 'Shopping list' }).click();
    await page.waitForURL('**/shopping-list');
    await screenshot(page, shotDir, `${name}-step-2`);

    const firstRow = page.locator('.row').first();
    const itemName = await firstRow.locator('.item-name').textContent();
    if (!itemName?.trim()) {
      drift.push('No items on list to remove');
    } else {
      steps.push(`Remove item: ${itemName.trim()}`);
      await screenshot(page, shotDir, `${name}-step-3`);
      await firstRow.getByRole('button', { name: /Remove/ }).click();
      if (await page.getByText(itemName.trim(), { exact: true }).isVisible()) {
        drift.push('Item still visible after Remove');
      }
      await screenshot(page, shotDir, `${name}-step-4`);
    }
  } catch (e) {
    drift.push(`Failed: ${e.message}`);
  }

  report.guides[name] = { steps, drift, pass: drift.length === 0 };
}

async function main() {
  const shotDir = new URL('../docs/guides/assets', import.meta.url).pathname;
  const reportDir = new URL('../docs/reports', import.meta.url).pathname;
  await mkdir(reportDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await testAddRecipeToShoppingList(page, shotDir);
  await captureAddToShoppingList(page, shotDir);
  await captureEditShoppingList(page, shotDir);
  await captureRemoveFromShoppingList(page, shotDir);

  await browser.close();

  const today = new Date().toISOString().slice(0, 10);
  const reportPath = join(reportDir, `${today}-playwright-walkthrough.json`);
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  const failed = Object.values(report.guides).filter((g) => !g.pass).length;
  process.exit(failed > 0 ? 0 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});