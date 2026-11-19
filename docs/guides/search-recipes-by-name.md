---
title: "Search recipes by name"
description: "Use the search field on the Recipe book page to type a recipe name."
type: guide
---

# Search recipes by name

The Recipe book page includes a search field under **ALL RECIPES** so you can type part of a recipe name.

**Demo URL:** https://demo-angular-22-wgdt.free.ccpve.co.za

## Known issue (live demo, 2026-11-19)

On the current deployment, typing in the field with placeholder **Search recipes** updates the text in the box but **does not** narrow **ALL RECIPES**. All recipes stay visible until a fix is deployed.

## Steps

### Step 1 — Sign in

1. Open the demo URL. You see the **Log in** page.
2. Type any **Email** and **Password**.
3. Click the blue **Log in** button inside the white card.

You land on **Recipe book**.

![Recipe book after sign-in](/assets/guides/search-recipes-by-name/step-1-recipe-book.png)

### Step 2 — Focus the search field

Under **ALL RECIPES**, click the search field. Its placeholder is **Search recipes**.

![Search field under All recipes](/assets/guides/search-recipes-by-name/step-2-search-field.png)

### Step 3 — Type a recipe name

Type part of a name, for example `carbonara`.

**On the current deployment:** the text appears in the field, but **ALL RECIPES** still lists every recipe (for example **Spaghetti carbonara**, **Chicken tikka masala**, and **Vegetable stir-fry**).

![Search text entered; list not filtered on current deployment](/assets/guides/search-recipes-by-name/step-3-filtered.png)

### Step 4 — Clear or change the search (optional)

Delete the text in the search field or type a different term. When filtering works, only matching recipes stay in the list.

![Search field cleared](/assets/guides/search-recipes-by-name/step-4-cleared-search.png)