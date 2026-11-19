# Recipe Book docs

Documentation for the [Recipe Book demo](https://demo-angular-22-wgdt.free.ccpve.co.za) ([app repo](https://github.com/BrentonJScott/demo-angular-22)), kept in a dedicated docs repository.

## User guides (one per documented feature)

| Feature | Guide |
|---|---|
| Add to Shopping list | [Add an item to your shopping list](docs/guides/add-to-shopping-list.md) |
| Edit shopping list items | [Edit a shopping list item](docs/guides/edit-shopping-list.md) |
| Remove from shopping list | [Remove an item from your shopping list](docs/guides/remove-from-shopping-list.md) |
| Add recipe items to shopping list | [Add a recipe to your shopping list](docs/guides/add-recipe-to-shopping-list.md) |

| Doc | Type |
|---|---|
| [Recipe Book pages](docs/info/recipe-book-pages.md) | Information |

## Docs site

Built with [Docusaurus](https://docusaurus.io). Only the guides and info pages live in `docs/`; screenshots are in `static/assets/` and test reports in `reports/`.

```
npm install
npm start        # dev server
npm run build    # static site in build/
npm run serve    # preview the build
```

## Validation

Headless Playwright checks: `node scripts/walkthrough-test.mjs` (requires `EMAIL` and `PASSWORD` in the environment). Reports are written under `reports/`.

## Version

`version.json` holds the app version these docs describe (`appVersion`). The app reports its own version at `/version.json`, written on every build. When the two differ, the docs need checking; after the docs are updated, `appVersion` is set to the app's version.