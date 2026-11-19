// @ts-check
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Recipe Book docs',
  tagline: 'Guides for the Recipe Book demo app',
  url: 'https://example.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'throw' } },
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    [
      'classic',
      {
        docs: { routeBasePath: '/', sidebarPath: './sidebars.js' },
        blog: false,
        theme: {},
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Recipe Book docs',
      items: [
        {
          href: 'https://demo-angular-22-wgdt.free.ccpve.co.za',
          label: 'Demo app',
          position: 'right',
        },
        {
          href: 'https://github.com/BrentonJScott/cc-demo-walkthrough-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
};

module.exports = config;
