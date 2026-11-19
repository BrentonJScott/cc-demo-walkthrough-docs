#!/usr/bin/env node
/**
 * Cron audit: one row per DOCUMENTED_FEATURES.MD feature — functional + doc fidelity (main guides).
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://demo-angular-22-wgdt.free.ccpve.co.za';
const EMAIL = process.env.EMAIL || '';
const PASSWORD = process.env.PASSWORD || '';
const ROOT = path.resolve(import.meta.dirname, '..');
const GUIDES_DIR = path.join(ROOT, 'docs/guides');

/** @type {{ feature: string, guide: string | null, functional: 'pass'|'fail', doc_fidelity: 'pass'|'drift'|'fail', mismatches: { step: string, doc: string, actual: string }[], functionalNotes: string[] }}[] */
const results = [];

const FEATURE_MAP = [
  { feature: 'Add to Shopping list', guide: 'add-to-shopping-list.md' },
  { feature: 'Remove from shopping list', guide: 'remove-from-shopping-list.md' },
  { feature: 'Clear all items from the shopping list', guide: 'clear-all-shopping-list.md' },
  { feature: 'Add recipe items to shopping list', guide: 'add-recipe-to-shopping-list.md' },
  {
    feature:
      'Add a new recipe (name, description, time, serves, and ingredients entered one per line as "name, amount")',
    guide: 'add-new-recipe.md',
  },
  { feature: 'Search recipes by name', guide: 'search-recipes-by-name.md' },
  {
    feature:
      "Adjust a recipe's servings with +/- buttons; ingredient amounts scale to match, and the scaled amounts are added to the shopping list",
    guide: 'adjust-recipe-servings.md',
  },
  {
    feature:
      'New recipe flow (4 steps with a progress bar, Back/Next, and Cancel): Add recipe, Shopping list, Rate a recipe and Share',
    guide: 'new-recipe-flow.md',
  },
];

function guideExists(file) {
  return file && fs.existsSync(path.join(GUIDES_DIR, file));
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

function pushResult(entry) {
  results.push(entry);
}

function makeResult(feature, guide) {
  const missing = !guideExists(guide);
  const row = {
    feature,
    guide: guide || '(none)',
    functional: 'pass',
    doc_fidelity: missing ? 'fail' : 'pass',
    mismatches: [],
    functionalNotes: [],
  };
  if (missing) {
    row.mismatches.push({
      step: '(guide)',
      doc: `Guide file ${guide} required for feature`,
      actual: 'Not present on main branch',
    });
    row.functional = 'fail';
    row.functionalNotes.push('No guide on main; skipped structured fidelity steps');
  }
  return row;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // --- Feature 1: Add to shopping list ---
    {
      const R = makeResult(FEATURE_MAP[0].feature, FEATURE_MAP[0].guide);
      if (guideExists(FEATURE_MAP[0].guide)) {
        await page.goto(BASE, { waitUntil: 'networkidle' });
        const h1 = await visibleText(page.locator('main.auth h1'));
        if (h1 !== 'Log in') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 1', doc: 'Log in page', actual: `h1 "${h1}"` });
        }
        const loginVisible = await visibleText(page.locator('main.auth .btn-primary'));
        if (loginVisible !== 'Log in') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({
            step: 'Step 1',
            doc: 'blue "Log in" link inside the white card',
            actual: `visible "${loginVisible}" on .btn-primary`,
          });
        }
        await login(page);
        const recipesTitle = await visibleText(page.locator('h1'));
        if (recipesTitle !== 'Recipe book') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 1', doc: 'Recipes page', actual: `h1 "${recipesTitle}"` });
        }
        await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
        await page.waitForURL('**/shopping-list');
        const slTitle = await visibleText(page.locator('h1'));
        if (slTitle !== 'Shopping list') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 2', doc: 'title "Shopping list"', actual: `"${slTitle}"` });
        }
        const addSection = await visibleText(page.locator('section').first().locator('.section-label'));
        if (addSection !== 'ADD ITEM') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 2', doc: 'ADD ITEM', actual: `"${addSection}"` });
        }
        const ingLabel = await visibleText(page.locator('label[for="item-name"]'));
        if (ingLabel !== 'Ingredient') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 3', doc: 'Ingredient', actual: `"${ingLabel}"` });
        }
        const ph = await page.locator('#item-name').getAttribute('placeholder');
        if (ph !== 'e.g. Tomatoes') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 3', doc: 'placeholder e.g. Tomatoes', actual: `"${ph}"` });
        }
        const amtLabel = await visibleText(page.locator('label[for="item-amount"]'));
        if (amtLabel !== 'Amount') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 4', doc: 'Amount', actual: `"${amtLabel}"` });
        }
        const unique = `Cron-${Date.now()}`;
        await page.locator('#item-name').fill(unique);
        await page.locator('#item-amount').fill('6');
        const addBtn = await visibleText(page.locator('form.form button[type="submit"]'));
        if (addBtn !== 'Add item') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 5', doc: 'Add item button', actual: `"${addBtn}"` });
        }
        await page.locator('form.form button[type="submit"]').click();
        await page.locator('.row', { hasText: unique }).waitFor({ state: 'visible' });
        const cleared = (await page.locator('#item-name').inputValue()) === '';
        if (!cleared) {
          R.functional = 'fail';
          R.functionalNotes.push('Fields did not clear after Add item');
        }
      }
      pushResult(R);
    }

    // --- Feature 2: Remove ---
    {
      const R = makeResult(FEATURE_MAP[1].feature, FEATURE_MAP[1].guide);
      if (guideExists(FEATURE_MAP[1].guide)) {
        await login(page);
        await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
        const itemsLabel = await visibleText(page.locator('section .section-label', { hasText: 'Items' }).first());
        if (itemsLabel !== 'ITEMS') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 1', doc: 'ITEMS', actual: `"${itemsLabel}"` });
        }
        const unique = `Rm-${Date.now()}`;
        await page.locator('#item-name').fill(unique);
        await page.locator('form.form button[type="submit"]').click();
        await page.locator('.item-name', { hasText: unique }).waitFor({ state: 'visible' });
        const removeBtn = page.getByRole('button', { name: `Remove ${unique}`, exact: true });
        const hasRemove = (await removeBtn.count()) > 0;
        if (!hasRemove) {
          R.doc_fidelity = 'drift';
          R.mismatches.push({
            step: 'Step 2',
            doc: 'trash Remove icon (tooltip Remove)',
            actual: 'no Remove control with tooltip-only access',
          });
        }
        await removeBtn.click();
        await page.waitForTimeout(300);
        if ((await page.locator('.item-name', { hasText: unique }).count()) > 0) {
          R.functional = 'fail';
          R.functionalNotes.push('Row not removed');
        }
      }
      pushResult(R);
    }

    // --- Feature 3: Clear all ---
    {
      const R = makeResult(FEATURE_MAP[2].feature, FEATURE_MAP[2].guide);
      if (guideExists(FEATURE_MAP[2].guide)) {
        // unreachable on main
      } else {
        await login(page);
        await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shopping list' }).click();
        const clearAll = page.getByRole('button', { name: 'Clear all' });
        if ((await clearAll.count()) === 0) {
          await page.locator('#item-name').fill('seed');
          await page.locator('form.form button[type="submit"]').click();
        }
        if ((await clearAll.count()) > 0) {
          await clearAll.click();
          const empty = await page.locator('.empty').isVisible();
          if (!empty) {
            R.functional = 'fail';
            R.functionalNotes.push('Clear all did not empty list');
          } else {
            R.functional = 'pass';
            R.functionalNotes.push('Clear all works on live site; guide missing on main');
          }
        }
      }
      pushResult(R);
    }

    // --- Feature 4: Add recipe to list ---
    {
      const R = makeResult(FEATURE_MAP[3].feature, FEATURE_MAP[3].guide);
      if (guideExists(FEATURE_MAP[3].guide)) {
        await login(page);
        const allRecipes = await visibleText(page.locator('.section-label', { hasText: 'All recipes' }).first());
        if (allRecipes !== 'ALL RECIPES') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 2', doc: 'ALL RECIPES', actual: `"${allRecipes}"` });
        }
        await page.getByRole('button', { name: /Spaghetti carbonara/i }).click();
        const details = await visibleText(page.locator('.section-label', { hasText: 'Details' }).first());
        if (details !== 'DETAILS') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 2', doc: 'DETAILS', actual: `"${details}"` });
        }
        const ingSection = await visibleText(page.locator('.details .section-label', { hasText: 'Ingredients' }));
        if (ingSection !== 'INGREDIENTS') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 3', doc: 'INGREDIENTS', actual: `"${ingSection}"` });
        }
        const addBtn = await visibleText(page.locator('.details .btn-primary'));
        if (addBtn !== 'Add to shopping list') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 4', doc: 'Add to shopping list', actual: `"${addBtn}"` });
        }
        const before = await page.locator('.row .item-name').count();
        await page.locator('.details .btn-primary').click();
        await page.waitForURL('**/shopping-list');
        const after = await page.locator('.row .item-name').count();
        if (after <= before) {
          R.functional = 'fail';
          R.functionalNotes.push('Ingredients not added to shopping list');
        }
      }
      pushResult(R);
    }

    // --- Feature 5: Add new recipe (fields) ---
    {
      const R = makeResult(FEATURE_MAP[4].feature, FEATURE_MAP[4].guide);
      await login(page);
      const newBtn = await visibleText(page.locator('a.new-btn'));
      if (newBtn !== 'New recipe') {
        if (guideExists(FEATURE_MAP[4].guide)) {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 2', doc: 'New recipe', actual: `"${newBtn}"` });
        }
      }
      await page.locator('a.new-btn').click();
      await page.waitForURL('**/recipes/new');
      const wizardH1 = await visibleText(page.locator('h1'));
      const onWizard = wizardH1 === 'New recipe';
      if (!onWizard) {
        R.functional = 'fail';
        R.functionalNotes.push('New recipe navigation did not open wizard');
      } else {
        const nameLabel = await visibleText(page.locator('label[for="recipe-name"]'));
        const labelsOk =
          nameLabel === 'Name' &&
          (await visibleText(page.locator('label[for="recipe-description"]'))) === 'Description';
        if (!labelsOk && guideExists(FEATURE_MAP[4].guide)) {
          R.doc_fidelity = 'drift';
        }
        if (!guideExists(FEATURE_MAP[4].guide)) {
          R.functionalNotes.push('Wizard opens on live site; guide missing on main');
          R.functional = onWizard ? 'pass' : 'fail';
        }
      }
      pushResult(R);
    }

    // --- Feature 6: Search ---
    {
      const R = makeResult(FEATURE_MAP[5].feature, FEATURE_MAP[5].guide);
      await login(page);
      const ph = await page.locator('input.search').getAttribute('placeholder');
      if (ph !== 'Search recipes') {
        if (guideExists(FEATURE_MAP[5].guide)) {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 2', doc: 'placeholder Search recipes', actual: `"${ph}"` });
        }
      }
      const countBefore = await page.locator('button.recipe').count();
      await page.locator('input.search').fill('carbonara');
      await page.waitForTimeout(200);
      const countAfter = await page.locator('button.recipe').count();
      const visibleNames = await page.locator('button.recipe strong').allTextContents();
      const filtered =
        countAfter < countBefore && visibleNames.every((n) => n.toLowerCase().includes('carbonara'));
      if (!filtered) {
        R.functional = 'fail';
        R.functionalNotes.push(
          `Search did not narrow list (${countBefore} -> ${countAfter}); visible: ${visibleNames.join(', ')}`,
        );
      }
      if (!guideExists(FEATURE_MAP[5].guide)) {
        R.functionalNotes.push('Search behavior tested; guide missing on main');
      }
      pushResult(R);
    }

    // --- Feature 7: Adjust servings ---
    {
      const R = makeResult(FEATURE_MAP[6].feature, FEATURE_MAP[6].guide);
      await login(page);
      await page.getByRole('button', { name: /Spaghetti carbonara/i }).click();
      const firstAmount = await visibleText(page.locator('.details ul li').first().locator('.muted'));
      const plus = page.locator('.stepper button', { hasText: '+' });
      await plus.click();
      await page.waitForTimeout(150);
      const secondAmount = await visibleText(page.locator('.details ul li').first().locator('.muted'));
      const stepVal = await visibleText(page.locator('.step-value'));
      const scaled = firstAmount !== secondAmount;
      if (!scaled) {
        R.functional = 'fail';
        R.functionalNotes.push(`Servings stepper shows ${stepVal} but amounts unchanged (${firstAmount})`);
      }
      if (guideExists(FEATURE_MAP[6].guide)) {
        const minusVis = await plus.locator('xpath=preceding-sibling::button[1]').innerText();
        if (minusVis.trim() !== '−' && minusVis.trim() !== '-') {
          R.doc_fidelity = 'drift';
          R.mismatches.push({ step: 'Step 2', doc: 'visible − button', actual: `"${minusVis.trim()}"` });
        }
      }
      if (!guideExists(FEATURE_MAP[6].guide)) {
        R.functionalNotes.push('Servings tested on live; guide missing on main');
      }
      pushResult(R);
    }

    // --- Feature 8: New recipe wizard flow ---
    {
      const R = makeResult(FEATURE_MAP[7].feature, FEATURE_MAP[7].guide);
      await login(page);
      await page.locator('a.new-btn').click();
      await page.waitForURL('**/recipes/new');
      const progress = await page.locator('ol.progress li').allTextContents();
      const expected = ['Add recipe', 'Shopping list', 'Rate', 'Share'];
      const progressText = progress.map((t) => t.replace(/\s+/g, ' ').trim());
      const labelsMatch = expected.every((e, i) => progressText[i]?.includes(e));
      if (!labelsMatch) {
        R.functional = 'fail';
        R.functionalNotes.push(`Progress labels: ${progressText.join(' | ')}`);
      }
      const cancel = await visibleText(page.locator('a.cancel'));
      const next = await visibleText(page.locator('button[type="submit"]'));
      if (cancel !== 'Cancel' || next !== 'Next') {
        R.doc_fidelity = R.doc_fidelity === 'fail' ? 'fail' : 'drift';
        R.mismatches.push({
          step: 'Step 1',
          doc: 'Cancel and Next visible controls',
          actual: `Cancel="${cancel}", Next="${next}"`,
        });
      }
      await page.locator('#recipe-name').fill('Cron Test Soup');
      await page.locator('button[type="submit"]').click();
      const step2 = await visibleText(page.locator('h2'));
      if (!step2.includes('shopping list')) {
        R.functional = 'fail';
        R.functionalNotes.push(`Step 2 heading: "${step2}"`);
      }
      const back = await visibleText(page.locator('button', { hasText: 'Back' }));
      if (back !== 'Back') {
        R.mismatches.push({ step: 'Step 2', doc: 'Back button', actual: `"${back}"` });
        if (R.doc_fidelity !== 'fail') R.doc_fidelity = 'drift';
      }
      if (!guideExists(FEATURE_MAP[7].guide)) {
        R.functionalNotes.push('Four-step wizard works on live; dedicated guide missing on main');
        if (R.functional !== 'fail') R.functional = 'pass';
      }
      pushResult(R);
    }
  } finally {
    await browser.close();
  }

  const date = new Date().toISOString().slice(0, 10);
  const out = path.join(ROOT, `reports/${date}-cron-audit.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(results, null, 2));

  let md = `# DOCUMENTED_FEATURES cron audit (${date})\n\nTarget: ${BASE}\n\n`;
  md += `| Feature | Guide | Functional | Doc fidelity |\n|---|---|---|---|\n`;
  for (const r of results) {
    md += `| ${r.feature.replace(/\|/g, '\\|')} | ${r.guide} | ${r.functional} | ${r.doc_fidelity} |\n`;
  }
  md += `\n## Mismatches\n\n`;
  for (const r of results) {
    if (!r.mismatches.length && !r.functionalNotes.length) continue;
    md += `### ${r.guide} — ${r.feature}\n\n`;
    for (const m of r.mismatches) {
      md += `- **${m.step}:** doc says ${m.doc}; on screen: ${m.actual}\n`;
    }
    for (const n of r.functionalNotes) {
      md += `- _(functional)_ ${n}\n`;
    }
    md += '\n';
  }
  const outMd = path.join(ROOT, `reports/${date}-cron-audit.md`);
  fs.writeFileSync(outMd, md);
  console.log(md);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});