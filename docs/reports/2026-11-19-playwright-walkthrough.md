---
title: "Playwright walkthrough report (2026-11-19)"
description: "Step-by-step results from headless Playwright against the hosted Recipe Book demo."
type: report
---

# Playwright walkthrough report

- **App URL:** https://demo-angular-22-wgdt.free.ccpve.co.za  
- **Tested:** 2026-11-19 (UTC)  
- **Features source:** `DOCUMENTED_FEATURES.MD` in demo-angular-22 (`main`)

## Feature ↔ documentation map

| Feature (DOCUMENTED_FEATURES.MD) | Guide doc | Status |
|---|---|---|
| Add to Shopping list | `docs/guides/add-to-shopping-list.md` | **Added** this run (was missing on `main`) |
| Remove from shopping list | `docs/guides/remove-from-shopping-list.md` | **Added** this run (was missing on `main`) |
| Add recipe items to shopping list | `docs/guides/add-recipe-to-shopping-list.md` | Existed; tested below |

`docs/info/recipe-book-pages.md` is informational only and is not tied to a feature line in `DOCUMENTED_FEATURES.MD`.

---

## `add-recipe-to-shopping-list.md`

| # | Doc step | Playwright action | Result |
|---|---|---|---|
| 1 | Log in with Email, Password, click **Log in** | Filled fields; clicked form **Log in** link (not header tab) | **OK** — **Recipes** opens |
| 2 | Click a recipe under **All recipes** | Clicked **Spaghetti carbonara** | **OK** — **Details** updates |
| 3 | Check **Ingredients** under **Details** | Verified **Ingredients** visible | **OK** |
| 4 | Click **Add to shopping list** | Clicked button; waited for `/shopping-list` | **OK** |

**Drift / clarity (doc still accurate but easy to misread):**

- **Log in control:** The form uses a **link** styled as a button, not a `<button>`. There are two **Log in** links on the page (header tab + form). The doc says “click **Log in**” without saying to use the one in the card — users may click the wrong control.
- **Pre-filled list:** The demo seeds five items in `ShoppingList` (`data.ts`). Step 4 says ingredients are “added” under **Items**, which is true, but readers may not expect existing rows before they add a recipe.

Automated run: all steps **pass** (`scripts/walkthrough.mjs`).

---

## `add-to-shopping-list.md` (new)

| # | Doc step | Playwright action | Result |
|---|---|---|---|
| 1 | Sign in | Email, Password, form **Log in** | **OK** |
| 2 | **Shopping list** tab | Navigated to shopping list | **OK** |
| 3 | Fill **Ingredient** / **Amount** | Added unique test item | **OK** |
| 4 | **Add item** | Item visible in **Items** | **OK** |

No drift detected against the hosted app for steps written in the new guide.

---

## `remove-from-shopping-list.md` (new)

| # | Doc step | Playwright action | Result |
|---|---|---|---|
| 1–2 | Sign in, open **Shopping list** | Login + tab | **OK** |
| 3 | **Remove** on one row | Removed **Spaghetti** | **OK** |
| 4 | Row gone, count decreases | Verified item absent | **OK** |

No drift detected.

---

## How to re-run

From `cc-demo-walkthrough-docs` (requires `EMAIL` and `PASSWORD` in the environment):

```bash
npm install playwright@1.49.0
npx playwright install chromium
node scripts/walkthrough.mjs
```

Machine-readable output: `docs/reports/YYYY-MM-DD-playwright-walkthrough.json`.