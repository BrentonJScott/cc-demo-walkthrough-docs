# DOCUMENTED_FEATURES cron audit (2026-11-19)

Target: https://demo-angular-22-wgdt.free.ccpve.co.za

| Feature | Guide | Functional | Doc fidelity |
|---|---|---|---|
| Add to Shopping list | add-to-shopping-list.md | pass | pass |
| Remove from shopping list | remove-from-shopping-list.md | pass | pass |
| Clear all items from the shopping list | clear-all-shopping-list.md | pass | fail |
| Add recipe items to shopping list | add-recipe-to-shopping-list.md | pass | pass |
| Add a new recipe (name, description, time, serves, and ingredients entered one per line as "name, amount") | add-new-recipe.md | pass | fail |
| Search recipes by name | search-recipes-by-name.md | fail | fail |
| Adjust a recipe's servings with +/- buttons; ingredient amounts scale to match, and the scaled amounts are added to the shopping list | adjust-recipe-servings.md | fail | fail |
| New recipe flow (4 steps with a progress bar, Back/Next, and Cancel): Add recipe, Shopping list, Rate a recipe and Share | new-recipe-flow.md | fail | fail |

## Mismatches

### clear-all-shopping-list.md — Clear all items from the shopping list

- **(guide):** doc says Guide file clear-all-shopping-list.md required for feature; on screen: Not present on main branch
- _(functional)_ No guide on main; skipped structured fidelity steps
- _(functional)_ Clear all works on live site; guide missing on main

### add-new-recipe.md — Add a new recipe (name, description, time, serves, and ingredients entered one per line as "name, amount")

- **(guide):** doc says Guide file add-new-recipe.md required for feature; on screen: Not present on main branch
- _(functional)_ No guide on main; skipped structured fidelity steps
- _(functional)_ Wizard opens on live site; guide missing on main

### search-recipes-by-name.md — Search recipes by name

- **(guide):** doc says Guide file search-recipes-by-name.md required for feature; on screen: Not present on main branch
- _(functional)_ No guide on main; skipped structured fidelity steps
- _(functional)_ Search did not narrow list (3 -> 3); visible: Spaghetti carbonara, Chicken tikka masala, Vegetable stir-fry
- _(functional)_ Search behavior tested; guide missing on main

### adjust-recipe-servings.md — Adjust a recipe's servings with +/- buttons; ingredient amounts scale to match, and the scaled amounts are added to the shopping list

- **(guide):** doc says Guide file adjust-recipe-servings.md required for feature; on screen: Not present on main branch
- _(functional)_ No guide on main; skipped structured fidelity steps
- _(functional)_ Servings stepper shows 5 but amounts unchanged (400 g)
- _(functional)_ Servings tested on live; guide missing on main

### new-recipe-flow.md — New recipe flow (4 steps with a progress bar, Back/Next, and Cancel): Add recipe, Shopping list, Rate a recipe and Share

- **(guide):** doc says Guide file new-recipe-flow.md required for feature; on screen: Not present on main branch
- _(functional)_ No guide on main; skipped structured fidelity steps
- _(functional)_ Four-step wizard works on live; dedicated guide missing on main

