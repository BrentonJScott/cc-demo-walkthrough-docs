# Playwright walkthrough report (2026-11-19)

**Cron audit summary**

| Source (`demo-angular-22` `DOCUMENTED_FEATURES.MD`) | Guide doc | Playwright doc result |
|---|---|---|
| Add to Shopping list | `docs/guides/add-to-shopping-list.md` | **Pass** (1 drift note below) |
| Edit shopping list items (inline name and amount editing) | `docs/guides/edit-shopping-list.md` | **Pass** |
| Remove from shopping list | `docs/guides/remove-from-shopping-list.md` | **Pass** |
| Add recipe items to shopping list | `docs/guides/add-recipe-to-shopping-list.md` | **Pass** |
| Add a new recipe (name, description, time, serves, ingredients) | `docs/guides/add-new-recipe.md` | **Pass** |

- **Feature count:** 5 (not 15 — `DOCUMENTED_FEATURES.MD` lists five user-facing features).
- **Missing guides:** none; no new-doc PR opened this run.
- **Fails:** none.
- **UI drift:** Edit/Remove guides correctly describe **Edit** and **Remove** text buttons (not icons). Only drift is `add-to-shopping-list.md`: the live demo seeds five shopping-list rows on first visit; the guide’s screenshots and text already call that out.

Target: https://demo-angular-22-wgdt.free.ccpve.co.za

## All guides (login)

| Step | Status | Detail |
|---|---|---|
| Enter Email/Password; Log in in form card | pass | Landed on Recipes |
| Enter Email/Password; Log in in form card | pass | Landed on Recipes |
| Enter Email/Password; Log in in form card | pass | Landed on Recipes |
| Enter Email/Password; Log in in form card | pass | Landed on Recipes |
| Enter Email/Password; Log in in form card | pass | Landed on Recipes |

## add-recipe-to-shopping-list.md

| Step | Status | Detail |
|---|---|---|
| 1 — Log in | pass | Recipes visible |
| 2–3 — Select recipe; Ingredients in Details | pass | Spaghetti in ingredients list |
| 4 — Add to shopping list | pass | Navigated to Shopping list |
| 5 — Items shows recipe ingredients | pass | All carbonara ingredients present |
| (context) pre-seeded items | pass | Demo seeds default rows; guide notes recipe ingredients append to existing Items |

## add-to-shopping-list.md

| Step | Status | Detail |
|---|---|---|
| 2 — Shopping list tab | pass | Add item form visible |
| (context) default Items | drift | Demo starts with 5 seeded rows (note in guide covers this) |
| 3–4 — Ingredient and Amount | pass | Filled Audit-1795076212484 |
| 5 — Add item | pass | Row added; fields cleared |

## edit-shopping-list.md

| Step | Status | Detail |
|---|---|---|
| 3 — Edit opens inline fields | pass | Ingredient name and Amount inputs visible |
| 4 — Save | pass | Row shows Spaghetti (e2e) |

## remove-from-shopping-list.md

| Step | Status | Detail |
|---|---|---|
| 1 — Open Shopping list | pass | Items section visible |
| 2 — Remove row | pass | Removed "Spaghetti" |
| 3 — Empty state (optional) | pass | Empty message shown |

## add-new-recipe.md

| Step | Status | Detail |
|---|---|---|
| 1 — Log in | pass | Recipes visible |
| 2 — New recipe form | pass | New recipe section with fields |
| 3 — Fill fields | pass | Name E2E soup 1795076216464 |
| 4 — Save recipe | pass | Recipe in All recipes |
| 4 — Details shows recipe | pass | Details h2: E2E soup 1795076216464 |
| (context) in-memory only | pass | New recipes are not persisted after refresh (DOCUMENTED_FEATURES / data.ts) |

