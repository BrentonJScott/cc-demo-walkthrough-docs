# Playwright walkthrough report — 2026-11-19

**App:** https://demo-angular-22-wgdt.free.ccpve.co.za  
**Features source:** `DOCUMENTED_FEATURES.MD` in [demo-angular-22](https://github.com/BrentonJScott/demo-angular-22)  
**Runner:** Headless Chromium (`playwright` npm package), credentials from environment `EMAIL` / `PASSWORD` (filled into the demo form; the app does not validate them).

## Feature ↔ documentation map

| `DOCUMENTED_FEATURES.MD` item | Doc on `main` before this run | Action |
|---|---|---|
| Add recipe items to shopping list | `docs/guides/add-recipe-to-shopping-list.md` | Tested (existing) |
| Add to Shopping list | *Missing* | Added in PR `docs/guides-with-screenshots-2026-11-19` |
| Remove from shopping list | *Missing* (old combined `manage-shopping-list.md` removed on main) | Added in PR `docs/guides-with-screenshots-2026-11-19` |

There are **three** documented features and **three** how-to guides after the PR (plus `docs/info/recipe-book-pages.md`, which is informational only).

---

## `add-recipe-to-shopping-list.md` (existing on main)

| Step | Doc instruction | Result | Notes |
|------|-----------------|--------|-------|
| 1 | Email, Password, **Log in** → **Recipes** | **Pass** | Two controls are labeled **Log in** on this page (header tab + primary button). Users must click the **blue Log in button in the form card**. |
| 2 | Click recipe under **All recipes** (e.g. Spaghetti carbonara) | **Pass** | |
| 3 | Check **Ingredients** under **Details** | **Pass** | Five ingredients shown for carbonara. |
| 4 | **Add to shopping list** | **Pass** | Navigates to **Shopping list**. |
| 5 | Ingredients appear under **Items** | **Pass** | All five recipe ingredients present. Hosted demo may show **more than five** rows when ingredients overlap names already on the list (e.g. Spaghetti, Eggs). Doc does not mention duplicates. |

**Drift:** Step 5 wording suggests only the recipe’s ingredients appear; the list can also contain other rows depending on session state. `recipe-book-pages.md` says the list resets on refresh, which matches the app.

---

## `add-to-shopping-list.md` (new guide — walkthrough against draft text)

| Step | Doc instruction | Result | Notes |
|------|-----------------|--------|-------|
| 1 | Sign in at demo URL | **Pass** | |
| 2 | Open **Shopping list** from header | **Pass** | |
| 3–5 | Ingredient, Amount, **Add item** | **Pass** | New row appears; fields clear. |

**Drift:** Older combined doc implied five default seed items. The **hosted** demo often starts with an **empty** **Items** section on a new browser session (local source code seeds five items). New guide text describes empty fields without assuming seed data.

---

## `remove-from-shopping-list.md` (new guide — walkthrough against draft text)

| Step | Doc instruction | Result | Notes |
|------|-----------------|--------|-------|
| 1–2 | Open list, click **Remove** on a row | **Pass** | Row removed. |
| 3 | Repeat until empty message | **Pass** (after adding rows when list was empty) | Guide now tells users to add an item first if **Items** is empty. |

**Drift:** Step 1 in a minimal doc assumed existing rows; fresh sessions need a prior add step (documented in the new guide).

---

## Raw machine log

Structured JSON from the automated run is in `2026-11-19-playwright-walkthrough.json` in this folder.