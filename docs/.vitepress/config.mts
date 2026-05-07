import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "2AQVDTM",
  description: "Documentation for the 2AQVDTM project",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        items: [
          { text: 'Documentation Frontend', link: '/Frontend_doc' },
          { text: 'Documentation Backend', link: '/Backend_doc' },
          { text: 'Structure de la Base de Données', link: '/database_structure' },
          { text: 'Documentation de l\'Architecture', link: '/Architecture_doc' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/OVDTM/2AQVDTM' }
    ]
  }
})
