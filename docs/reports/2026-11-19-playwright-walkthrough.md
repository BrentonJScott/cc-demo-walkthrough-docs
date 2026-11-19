# Playwright walkthrough report (2026-11-19)

Target: https://demo-angular-22-wgdt.free.ccpve.co.za

## All guides (login)

| Step | Status | Detail |
|---|---|---|
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
| (context) pre-seeded items | drift | List already had default demo items before add; doc does not mention seeded rows |

## add-to-shopping-list.md

| Step | Status | Detail |
|---|---|---|
| 2 — Shopping list tab | pass | Add item form visible |
| (context) default Items | drift | Demo starts with 5 seeded rows (note in guide covers this) |
| 3–4 — Ingredient and Amount | pass | Filled Audit-1795074232180 |
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

