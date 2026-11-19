# Document drift cron — 2026-11-19 09:05 UTC

Target: https://demo-angular-22-wgdt.free.ccpve.co.za (headless Playwright, team `EMAIL`/`PASSWORD` secrets)

Feature list: `demo-angular-22` `DOCUMENTED_FEATURES.MD` on `main` after `git pull` (6 features at audit start).

## Summary (this run, live site)

| Feature / guide | Functional | Doc fidelity | Action |
| --- | --- | --- | --- |
| `add-to-shopping-list.md` | pass | drift → **pass** (PR) | Step 1 post-login page title |
| `remove-from-shopping-list.md` | pass | pass | — |
| `add-recipe-to-shopping-list.md` | pass | drift → **pass** (PR) | Step 1 post-login page title |
| `clear-all-shopping-list.md` | pass | fail (missing) → **pass** (PR) | New guide + screenshots |
| `search-recipes-by-name.md` | fail | fail (missing) | New guide in docs PR; app PR wires `filtered()` (deploy required for live pass) |
| Add a new recipe (no guide) | fail | fail | Removed from `DOCUMENTED_FEATURES.MD` in app PR (control not on live demo) |

## Pre-fix mismatches

### `add-to-shopping-list.md`

- **Step 1:** Doc — *“You should land on the **Recipes** page.”* → Screen — visible `h1` is **Recipe book** (nav tab text **Recipes**).

### `add-recipe-to-shopping-list.md`

- **Step 1:** Doc — *“You land on **Recipes**.”* → Screen — visible `h1` **Recipe book**.

### `search-recipes-by-name.md` (missing guide)

- **Step 3 (intended):** Doc — *“recipe list shows only matching names”* → Screen — typing `carbon` leaves **3** recipe buttons visible (search field does not filter on deployed build).

### Add a new recipe

- **Feature list:** Doc — *“Add a new recipe …”* in `DOCUMENTED_FEATURES.MD` → Screen — no **New recipe** button or create form on **Recipe book**.

## Post-PR verification (local scripts)

After docs branch updates prose/screenshots, run on live (search step remains fail until app deploy):

```text
node scripts/doc-fidelity-audit.mjs
node scripts/walkthrough-test.mjs
```