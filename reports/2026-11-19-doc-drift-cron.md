# DOCUMENTED_FEATURES audit — 2026-11-19 cron (11:38 UTC)

**Source:** `demo-angular-22` `DOCUMENTED_FEATURES.MD` (8 features, one guide each)  
**Target:** https://demo-angular-22-wgdt.free.ccpve.co.za (headless Playwright, `EMAIL`/`PASSWORD`)

## Summary (main branch at run time)

| Feature | Guide | Functional | Doc fidelity |
|---|---|---|---|
| Add to Shopping list | `add-to-shopping-list.md` | pass | drift |
| Remove from shopping list | `remove-from-shopping-list.md` | pass | pass |
| Clear all items | `clear-all-shopping-list.md` | pass | fail (missing guide) |
| Add recipe items to shopping list | `add-recipe-to-shopping-list.md` | pass | drift |
| Add a new recipe | `add-new-recipe.md` | pass | fail (missing guide) |
| Search recipes by name | `search-recipes-by-name.md` | fail | fail (missing guide) |
| Adjust servings + scaled list | `adjust-recipe-servings.md` | fail | fail (missing guide) |
| New recipe flow (4 steps) | `new-recipe-flow.md` | pass | fail (missing guide) |

**PR:** Branch `docs/cron-2026-11-19-v5` adds missing guides, screenshots, and fixes landing-page title drift on two existing guides.

## Per-guide step fidelity (this run)

### `add-to-shopping-list.md`

| Step | Doc fidelity |
|---|---|
| Step 1 — sign in | drift |
| Step 2 — Shopping list | pass |
| Step 3 — Ingredient | pass |
| Step 4 — Amount | pass |
| Step 5 — Add item | pass |

- **Step 1:** Doc says you land on the **Recipes** page; visible page title is **Recipe book** (`h1`).

### `remove-from-shopping-list.md`

| Step | Doc fidelity |
|---|---|
| Step 1 — open list | pass |
| Step 2 — Remove icon | pass |
| Step 3 — empty message (optional) | pass (not exercised in E2E) |

### `add-recipe-to-shopping-list.md`

| Step | Doc fidelity |
|---|---|
| Step 1 — sign in | drift |
| Step 2 — ALL RECIPES / Details | pass |
| Step 3 — INGREDIENTS | pass |
| Step 4 — Add to shopping list | pass |

- **Step 1:** Doc says you land on **Recipes**; visible title is **Recipe book**.

### Missing on main (functional notes)

| Feature | Functional note |
|---|---|
| Clear all | **Clear all** works; empty state copy matches. |
| Add new recipe | **New recipe** opens `/recipes/new` with **Name**, **Description**, **Time**, **Serves**, **Ingredients**, **Next**. |
| Search | Placeholder **Search recipes** matches; filter does not run (3 recipes remain after typing `carbonara`). |
| Adjust servings | **+** updates stepper count but not ingredient amounts or **Serves** badge on deployment. |
| Wizard flow | Progress labels **Add recipe**, **Shopping list**, **Rate**, **Share**; **Cancel**, **Back**, **Next**/**Skip**/**Done** visible. |

## App issues (documented only — no code changes)

- Search field does not narrow **ALL RECIPES** on the live deployment.
- Servings stepper does not scale ingredient amounts or shopping-list quantities on the live deployment.