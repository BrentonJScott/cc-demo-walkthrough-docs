# Document drift cron — 2026-11-19 09:30 UTC

Target: https://demo-angular-22-wgdt.free.ccpve.co.za (headless Playwright, `EMAIL`/`PASSWORD` secrets)

Feature list: `demo-angular-22` `DOCUMENTED_FEATURES.MD` on `main` after `git pull origin main` (7 features).

## Summary

| Feature / guide | Functional | Doc fidelity | Notes |
| --- | --- | --- | --- |
| `add-to-shopping-list.md` | pass | drift → PR | Step 1 post-login title |
| `remove-from-shopping-list.md` | pass | pass | — |
| `clear-all-shopping-list.md` | pass | fail → PR | Guide missing on `main` |
| `add-recipe-to-shopping-list.md` | pass | drift → PR | Step 1 post-login title |
| `add-new-recipe.md` | fail | fail → PR | Missing guide; **New recipe** click did not open form on live |
| `search-recipes-by-name.md` | fail | fail → PR | Missing guide; search field does not filter list on live |
| `adjust-recipe-servings.md` | fail | fail → PR | Missing guide; **+** changes count but amounts do not scale on live |

## Per-step mismatches (pre-PR live audit)

### `add-to-shopping-list.md`

- **Step 1:** Doc — *"land on the **Recipes** page"* → Screen — h1 **Recipe book**

### `add-recipe-to-shopping-list.md`

- **Step 1:** Doc — *"You land on **Recipes**"* → Screen — h1 **Recipe book**

### Missing guides

- **Clear all / Search / Adjust servings / Add new recipe:** No matching `docs/guides/*.md` on `main` before this cron PR.

### Live functional failures (app; see `demo-angular-22` PR)

- **New recipe:** Visible **New recipe** button; click did not show `#recipe-name` form.
- **Search:** Placeholder **Search recipes** present; `zzznomatch123` and `carbonara` still showed all three recipes.
- **Servings:** **+** changed step value 4 → 5; first ingredient amount stayed **400 g**; shopping list received unscaled amounts.

## PRs

- Docs: `docs/cron-2026-11-19-v3` — prose fixes, four new guides, screenshots, remove obsolete edit guide.
- App: `fix/recipe-search-new-scale-2026-11-19` — wire **New recipe**, filter list by search, `selectRecipe` for filtered list.