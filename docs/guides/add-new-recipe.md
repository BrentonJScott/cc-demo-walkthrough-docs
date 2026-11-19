---
title: "Add a new recipe"
description: "Fill in name, description, time, serves, and ingredients on the first step of the New recipe wizard."
type: guide
---

# Add a new recipe

From **Recipe book**, click **New recipe** to open the first step of the four-step wizard at `/recipes/new`.

**Demo URL:** https://demo-angular-22-wgdt.free.ccpve.co.za

For the full wizard (shopping list, rating, and share steps), see [New recipe wizard flow](new-recipe-flow.md).

## Steps

### Step 1 — Sign in

1. Open the demo URL. On **Log in**, enter any **Email** and **Password**.
2. Click the blue **Log in** button in the white card.

You land on **Recipe book**.

![Recipe book after sign-in](/assets/guides/add-new-recipe/step-1-recipe-book.png)

### Step 2 — Open New recipe

At the top of the page, to the right of the recipe count chip, click **New recipe**.

You see the title **New recipe**, step counter **Step 1 of 4**, **Cancel** on the right, and the form fields below.

![New recipe wizard step 1](/assets/guides/add-new-recipe/step-2-form.png)

### Step 3 — Fill in the fields

Use the visible labels:

| Label | What to enter |
| --- | --- |
| **Name** | Recipe title (required) |
| **Description** | Short summary |
| **Time** | For example `30 min` |
| **Serves** | Number of people, for example `4` |
| **Ingredients** | One ingredient per line as `name, amount` (for example `Tomatoes, 6`) |

**Next** stays disabled until **Name** is not empty.

![Filled new recipe form](/assets/guides/add-new-recipe/step-3-form-filled.png)

### Step 4 — Continue to the next wizard step

Click the blue **Next** button at the bottom of the form.

**Success looks like this:**

- The wizard moves to **Step 2 of 4** with heading **Add ingredients to your shopping list** (see [New recipe wizard flow](new-recipe-flow.md)).