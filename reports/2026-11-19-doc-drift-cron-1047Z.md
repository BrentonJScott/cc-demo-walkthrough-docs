# Document drift cron — 2026-11-19 10:47 UTC

Target: https://demo-angular-22-wgdt.free.ccpve.co.za (headless Playwright, `EMAIL`/`PASSWORD` secrets)

Feature list: `demo-angular-22/DOCUMENTED_FEATURES.MD` on `main` (7 features, one guide each).

## Summary (this run)

| Guide | Functional | Doc fidelity (pre-PR) | Doc fidelity (expected post-PR) |
| --- | --- | --- | --- |
| `add-to-shopping-list.md` | pass | drift | pass |
| `remove-from-shopping-list.md` | pass | pass | pass |
| `clear-all-shopping-list.md` | pass | fail (missing) | pass |
| `add-recipe-to-shopping-list.md` | pass | drift | pass |
| `add-new-recipe.md` | fail | fail (missing) | pass (documents live limitation) |
| `search-recipes-by-name.md` | fail | fail (missing) | pass (documents live limitation) |
| `adjust-recipe-servings.md` | fail | fail (missing) | pass (documents live limitation) |

## Per-step mismatches (main before PR)

### `add-to-shopping-list.md` / `add-recipe-to-shopping-list.md`

- **Step 1 (landing):** Doc — *"You should land on the **Recipes** page"* → Screen — page title **Recipe book** (`h1`), header tab **Recipes**.

### Missing guides (features 3, 5, 6, 7)

No markdown guide on `main` for clear all, new recipe, search, or adjust servings.

## Functional issues (live app — not fixed in this PR)

| Feature | Result | Notes |
| --- | --- | --- |
| Add new recipe | fail | **New recipe** visible; form does not open; **Save recipe** never appears |
| Search recipes | fail | **Search recipes** field accepts text; list does not filter |
| Adjust servings | fail | Stepper number changes; ingredient amounts and **Serves** badge unchanged; shopping list gets default amounts |

Evidence: `node scripts/cron-2026-11-19-audit.mjs` (local cron script, not committed).