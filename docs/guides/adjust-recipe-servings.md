---
title: "Adjust recipe servings"
description: "Use the − and + controls next to Ingredients on the Recipe book page."
type: guide
---

# Adjust a recipe's servings

The **Details** panel shows a servings stepper next to **Ingredients**: **−**, a number, and **+**.

**Demo URL:** https://demo-angular-22-wgdt.free.ccpve.co.za

## Known issue (live demo)

On the current deployment, clicking **+** or **−** updates the number between the buttons, but ingredient amounts in the list and the **Serves** badge do **not** change. **Add to shopping list** still adds the default amounts, not scaled amounts.

## Steps

### Step 1 — Sign in and pick a recipe

1. Open the demo URL and sign in (any **Email** and **Password**; blue **Log in** link in the form card).
2. Under **ALL RECIPES**, click a recipe, for example **Spaghetti carbonara**.

The **Details** panel shows the recipe name and an ingredient list.

![Recipe selected in Details](/assets/guides/adjust-recipe-servings/step-1-details.png)

### Step 2 — Find the servings controls

In **Details**, under **INGREDIENTS**, look at the right side of the heading row. You see:

- A **−** button (outline style)
- A number showing the current count (for example `4`)
- A **+** button (outline style)

Above the ingredients, a **Serves** badge shows the recipe’s original serving size (for example **Serves 4**).

![Servings stepper next to Ingredients](/assets/guides/adjust-recipe-servings/step-2-stepper.png)

### Step 3 — Increase or decrease servings

Click **+** or **−** (**−** is disabled at 1 serving).

**On the current deployment:** the number between **−** and **+** changes, but ingredient amounts (for example **400 g** next to Spaghetti) stay the same.

![After clicking +; amounts unchanged on current deployment](/assets/guides/adjust-recipe-servings/step-3-scaled-amounts.png)

### Step 4 — Add items to the shopping list

Click the blue **Add to shopping list** button at the bottom of **Details**.

On **Shopping list**, new rows use the recipe’s default amounts from **Details**, not amounts scaled to the stepper value on the current deployment.

![Shopping list after Add to shopping list](/assets/guides/adjust-recipe-servings/step-4-shopping-list.png)