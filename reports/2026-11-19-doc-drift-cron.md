# Document drift cron — 2026-11-19 08:36 UTC

Target: https://demo-angular-22-wgdt.free.ccpve.co.za (headless Playwright, team `EMAIL`/`PASSWORD` secrets)

Feature list source: `demo-angular-22` `DOCUMENTED_FEATURES.MD` on `main` after `git pull` (5 features at audit start; 4 after sync PR).

## Summary

| Guide | Functional | Doc fidelity | Action |
| --- | --- | --- | --- |
| `add-recipe-to-shopping-list.md` | pass | pass | — |
| `add-to-shopping-list.md` | pass | drift → **pass** (PR) | Step 1: Log in control is a link, not a button |
| `edit-shopping-list.md` | pass | pass | — |
| `remove-from-shopping-list.md` | pass | drift → **pass** (PR) | Step 1: Log in control is a link, not a button |
| `add-new-recipe.md` | fail | fail | Feature absent on live demo and in app `main`; guide removed, `DOCUMENTED_FEATURES.MD` updated in app repo |

## Pre-fix mismatches (this run)

### `add-to-shopping-list.md`

- **Step 1:** Doc — *“Click the blue **Log in** button **inside the white card**”* → Screen — primary control is an `<a class="btn btn-primary">` with visible text **Log in** (link, not `<button>`).

### `remove-from-shopping-list.md`

- **Step 1:** Doc — *“use the blue **Log in** button in the form card”* → Screen — same **Log in** **link** in the form card.

### `add-new-recipe.md` (removed)

- **Step 2:** Doc — *“**New recipe** button at the top”* → Screen — no **New recipe** control on Recipes (removed from deployed app and `recipes.ts` on `main`).

## Post-PR verification

```text
node scripts/doc-fidelity-audit.mjs   # exit 0
node scripts/walkthrough-test.mjs       # exit 0
```

Screenshots refreshed via `node scripts/capture-guide-screenshots.mjs` for all four active guides.