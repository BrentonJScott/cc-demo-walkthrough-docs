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
| 3–4 — Ingredient and Amount | pass | Filled Audit-1795075408299 |
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
| 3 — Fill fields | pass | Name E2E soup 1795075412330 |
| 4 — Save recipe | pass | Recipe in All recipes |
| 4 — Details shows recipe | pass | Details h2: E2E soup 1795075412330 |
| (context) in-memory only | pass | New recipes are not persisted after refresh (DOCUMENTED_FEATURES / data.ts) |

