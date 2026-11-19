---
title: "Add a new recipe"
description: "Create a recipe with name, description, time, serves, and ingredients (one per line as name, amount)."
type: guide
---

# Add a new recipe

The Recipe book page shows a **New recipe** button for creating your own recipe.

**Demo URL:** https://demo-angular-22-wgdt.free.ccpve.co.za

## Known issue (live demo)

On the current deployment, **New recipe** is visible but does **not** open the form, and **Save recipe** is never shown. The steps below describe the controls in source; skip to the report notes if you only need to verify the live site today.

## Steps

### Step 1 — Sign in

1. Open the demo URL. On **Log in**, enter any **Email** and **Password**.
2. Click the blue **Log in** link in the white card.

You land on **Recipe book**.

![Recipe book after sign-in](/assets/guides/add-new-recipe/step-1-login.png)

### Step 2 — Locate New recipe

At the top of the page, to the right of the recipe count chip, click **New recipe**.

**On the current deployment:** **Details** stays on the selected recipe; the **NEW RECIPE** form does not appear.

![Recipe book with New recipe button](/assets/guides/add-new-recipe/step-2-new-recipe-form.png)

### Step 3 — Fill in the fields (when the form is available)

When the form opens, use the visible labels:

| Label | What to enter |
| --- | --- |
| **Name** | Recipe title (required) |
| **Description** | Short summary |
| **Time** | For example `30 min` |
| **Serves** | Number of people, for example `4` |
| **Ingredients** | One ingredient per line as `name, amount` (for example `Tomatoes, 6`) |

![Filled new recipe form (reference)](/assets/guides/add-new-recipe/step-3-form-filled.png)

### Step 4 — Save the recipe (when the form is available)

Click the blue **Save recipe** button at the bottom of the form.

**Success looks like this:**

- The form closes and **Details** shows your new recipe.
- The recipe appears in **ALL RECIPES** on the left.

![New recipe in the list (reference)](/assets/guides/add-new-recipe/step-4-saved-in-list.png)

To abandon the form without saving, click **Cancel**.