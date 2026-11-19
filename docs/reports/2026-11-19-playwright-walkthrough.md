---
title: "Playwright doc walkthrough report (2026-11-19)"
description: "Step-by-step follow results for each guide against the hosted Recipe Book demo."
type: report
---

# Doc walkthrough report — 2026-11-19

**App:** [Recipe Book demo](https://demo-angular-22-wgdt.free.ccpve.co.za)  
**Features source:** `DOCUMENTED_FEATURES.MD` in [demo-angular-22](https://github.com/BrentonJScott/demo-angular-22)  
**Runner:** Headless Playwright (`scripts/walkthrough-test.mjs`) with `EMAIL` / `PASSWORD` from the team Cloud Agent environment (filled on the login form; credentials are not validated by the app).

## Feature ↔ documentation map

| `DOCUMENTED_FEATURES.MD` item | Guide doc | Dedicated 1:1 doc before this run |
|---|---|---|
| Add recipe items to shopping list | `docs/guides/add-recipe-to-shopping-list.md` | Yes |
| Add to Shopping list | *(was bundled in `manage-shopping-list.md`)* | No — added `add-to-shopping-list.md` in PR |
| Remove from shopping list | *(was bundled in `manage-shopping-list.md`)* | No — added `remove-from-shopping-list.md` in PR |

## `add-recipe-to-shopping-list.md`

| Step | Doc instruction | Result |
|---|---|---|
| 1 | Log in with Email and Password → Recipes | **Pass** — form filled; **Log in** is a link on the main card (not a button in the header). |
| 2 | Click **Spaghetti carbonara** under All recipes | **Pass** |
| 3 | Check **Ingredients** under Details | **Pass** |
| 4 | Click **Add to shopping list** | **Pass** — navigates to Shopping list |
| 5 | Ingredients appear under **Items** | **Pass** — ingredients present (10 rows total after add) |
| — | — | **Drift:** Doc does not mention five seeded default items (`data.ts`). After add, duplicates can appear (e.g. Spaghetti, Eggs) alongside recipe ingredients. |

## `manage-shopping-list.md` — Add section *(superseded by `add-to-shopping-list.md`)*

| Step | Doc instruction | Result |
|---|---|---|
| 1 | Open Shopping list from header | **Pass** |
| 2–3 | Ingredient + Amount | **Pass** |
| 4 | Add item → bottom of list, fields cleared | **Pass** (10 → 11 items) |
| optional | Clear without adding | **Pass** |
| — | — | **Drift:** Step 1 omits login; list not empty on first visit. |

## `manage-shopping-list.md` — Remove section *(superseded by `remove-from-shopping-list.md`)*

| Step | Doc instruction | Result |
|---|---|---|
| pre | — | **Drift:** 11 items present before removes (seeded + prior test data in same session) |
| 1–2 | Find item, click Remove | **Pass** |
| 3 | Empty message | **Pass** — *Your shopping list is empty.* |

## Playwright MCP

The Playwright MCP server failed to launch a headed browser (no X server). Walkthroughs were executed with headless Chromium via the same step flow.