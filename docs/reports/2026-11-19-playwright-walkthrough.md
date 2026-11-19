---
title: "Playwright walkthrough report (2026-11-19)"
description: "Step-by-step results for each feature guide against the hosted Recipe Book demo."
type: report
---

# Playwright walkthrough report

**Demo:** https://demo-angular-22-wgdt.free.ccpve.co.za  
**Run:** 2026-11-19 (headless Chromium)

## Feature coverage

| DOCUMENTED_FEATURES.MD | Guide doc | Status |
|---|---|---|
| Add to Shopping list | `docs/guides/add-to-shopping-list.md` | Created in this PR (was missing) |
| Remove from shopping list | `docs/guides/remove-from-shopping-list.md` | Created in this PR (was missing) |
| Add recipe items to shopping list | `docs/guides/add-recipe-to-shopping-list.md` | Existed; tested below |

## add-recipe-to-shopping-list.md

**Drift / notes:** Step 1 calls Log in a "button"; on the login page it is a link inside the form (header also has a Log in tab on auth pages). Step 6 text suggests the list contains only the recipe ingredients; the demo seeds five items by default and add appends.

| Step | Result | Notes |
|---|---|---|
| 1 | pass | Filled Email/Password; clicked Log in link in form; Recipes page opened. |
| 2 | pass | Clicked Spaghetti carbonara under All recipes. |
| 3 | pass | Ingredients visible under Details. |
| 4 | pass | Shopping list opened. Doc implies only recipe ingredients; hosted app already had 0 seeded items — list now has 10 items total. |

## add-to-shopping-list.md

**Drift / notes:** List is not empty on first visit — five demo items appear before you add anything.

| Step | Result | Notes |
|---|---|---|
| 1 | pass | Logged in and opened Shopping list tab. |
| 2 | pass | Filled Ingredient and Amount fields. |
| 3 | pass | Clicked Add item; new row appeared. |

## remove-from-shopping-list.md

| Step | Result | Notes |
|---|---|---|
| 1 | pass | On Shopping list with items visible. |
| 2 | pass | Clicked Remove on "Walkthrough lemons". |
| 3 | pass | Row count 6 → 5. |

## DOCUMENTED_FEATURES mapping

**Drift / notes:** Three features in DOCUMENTED_FEATURES.MD; one guide existed before this run.

| Step | Result | Notes |
|---|---|---|

