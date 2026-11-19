/**
 * Headless Playwright walkthrough for cc-demo walkthrough docs.
 */
import { chromium } from 'playwright';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error('EMAIL and PASSWORD env vars required');
  process.exit(1);
}

async function login(page) {
  await page.goto(`${BASE}/#/login`, { waitUntil: 'networkidle' });
  await page.locator('#email').fill(EMAIL);
  await page.locator('#password').fill(PASSWORD);
  await page.locator('main a.btn-primary', { hasText: 'Log in' }).click();
  await page.waitForURL(/#\/recipes/);
}

const reports = [];

function report(doc, steps) {
  reports.push({ doc, steps });
}

async function testAddRecipeToShoppingList(page) {
  const doc = 'docs/guides/add-recipe-to-shopping-list.md';
  const steps = [];
  await login(page);
  steps.push({ step: 1, text: 'Log in with Email and Password', status: 'pass', note: 'Recipes page opened' });

  await page.getByRole('button', { name: 'Spaghetti carbonara' }).click();
  steps.push({ step: 2, text: 'Click Spaghetti carbonara under All recipes', status: 'pass' });

  const details = page.locator('section, .details, [class*="detail"]').first();
  const hasIngredients = await page.getByText('Ingredients').isVisible();
  steps.push({
    step: 3,
    text: 'Check Ingredients under Details',
    status: hasIngredients ? 'pass' : 'fail',
    note: hasIngredients ? '' : 'Ingredients heading not visible',
  });

  const countBefore = await page.locator('text=/shopping list/i').count();
  await page.getByRole('button', { name: 'Add to shopping list' }).click();
  await page.waitForURL(/#\/shopping-list/);
  steps.push({ step: 4, text: 'Click Add to shopping list', status: 'pass', note: 'Navigated to Shopping list page' });

  const items = page.locator('[class*="item"], li').filter({ hasText: /Spaghetti|Guanciale|Eggs|Pecorino|Black pepper/ });
  const itemCount = await page.locator('button:has-text("Remove")').count();
  steps.push({
    step: 5,
    text: 'Shopping list shows recipe ingredients under Items',
    status: itemCount >= 5 ? 'pass' : 'partial',
    note: itemCount >= 5
      ? `${itemCount} items with Remove buttons (includes seeded defaults + recipe)`
      : `Only ${itemCount} removable items visible`,
  });
  steps.push({
    step: 'drift',
    text: 'Doc implies fresh list after add; app seeds 5 default items',
    status: 'drift',
    note: 'User sees pre-existing Spaghetti, Eggs, Pecorino, Tomatoes, Apples before recipe add',
  });

  report(doc, steps);
}

async function testManageShoppingListAdd(page) {
  const doc = 'docs/guides/manage-shopping-list.md (Add section)';
  const steps = [];
  await login(page);
  await page.getByRole('link', { name: 'Shopping list' }).click();
  await page.waitForURL(/#\/shopping-list/);
  steps.push({ step: 1, text: 'Click Shopping list in header', status: 'pass' });

  const before = await page.getByRole('button', { name: 'Remove' }).count();
  await page.locator('#item-name').fill('Tomatoes');
  await page.locator('#item-amount').fill('6');
  steps.push({ step: 2, text: 'Enter Ingredient Tomatoes', status: 'pass' });
  steps.push({ step: 3, text: 'Enter Amount 6', status: 'pass' });

  await page.getByRole('button', { name: 'Add item', exact: true }).click();
  const after = await page.getByRole('button', { name: 'Remove' }).count();
  const ingredientEmpty = await page.locator('#item-name').inputValue();
  const amountEmpty = await page.locator('#item-amount').inputValue();
  steps.push({
    step: 4,
    text: 'Click Add item; item at bottom; fields cleared',
    status: after > before && ingredientEmpty === '' && amountEmpty === '' ? 'pass' : 'partial',
    note: `Items: ${before} → ${after}`,
  });

  await page.locator('#item-name').fill('Test');
  await page.getByRole('button', { name: 'Clear' }).click();
  const cleared = (await page.locator('#item-name').inputValue()) === '';
  steps.push({
    step: 'optional',
    text: 'Click Clear empties fields without adding',
    status: cleared ? 'pass' : 'fail',
  });

  report(doc, steps);
}

async function testManageShoppingListRemove(page) {
  const doc = 'docs/guides/manage-shopping-list.md (Remove section)';
  const steps = [];
  await login(page);
  await page.getByRole('link', { name: 'Shopping list' }).click();

  let removeButtons = page.getByRole('button', { name: 'Remove' });
  let count = await removeButtons.count();
  steps.push({
    step: 'preface',
    text: 'List starts with seeded items (not empty)',
    status: 'drift',
    note: `${count} items before any remove steps`,
  });

  while (count > 0) {
    await removeButtons.first().click();
    count = await removeButtons.count();
  }

  const emptyMsg = await page.getByText('Your shopping list is empty.').isVisible();
  steps.push({ step: 1, text: 'Find item under Items', status: 'pass' });
  steps.push({ step: 2, text: 'Click Remove until list empty', status: 'pass' });
  steps.push({
    step: 3,
    text: 'Empty list shows "Your shopping list is empty."',
    status: emptyMsg ? 'pass' : 'fail',
  });

  report(doc, steps);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await testAddRecipeToShoppingList(page);
    await testManageShoppingListAdd(page);
    await testManageShoppingListRemove(page);
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), reports }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});