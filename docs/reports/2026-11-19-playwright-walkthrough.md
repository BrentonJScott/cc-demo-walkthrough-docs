# Playwright walkthrough report (2026-11-19)

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
| 3–4 — Ingredient and Amount | pass | Filled Audit-1795074901348 |
| 5 — Add item | pass | Row added; fields cleared |

## edit-shopping-list.md

| Step | Status | Detail |
|---|---|---|
| 3 — Edit opens inline fields | pass | Ingredient name and Amount inputs visible |
| 4 — Save | pass | Row shows Spaghetti (e2e) |

## add-new-recipe.md

| Step | Status | Detail |
|---|---|---|
| 1 — Log in | pass | Recipes visible |
| 2 — New recipe control | pass | New recipe button visible |
| 3–5 — New recipe form | pass | Form fields shown |
| 6 — Save recipe | pass | Recipe appears in All recipes |
| 6 — Details panel | pass | Details shows saved recipe |
| (context) ingredient lines | pass | 3 ingredients in Details |

## remove-from-shopping-list.md

| Step | Status | Detail |
|---|---|---|
| 1 — Open Shopping list | pass | Items section visible |
| 2 — Remove row | pass | Removed "Spaghetti" |
| 3 — Empty state (optional) | pass | Empty message shown |

