import { defineConfig } from "vitepress"

export default defineConfig({
  lang: "en-US",
  title: "VitePlay",
  description: "A fully auto-generated and interactive component development environment.",
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/viteplay-logo-icon.svg" }]],

  lastUpdated: true,
  // markdown: {
  //   toc: { level: 4 },
  // },

  // Theme related configurations.
  themeConfig: {
    logo: {
      light: "/viteplay-logo-wordmark-lightmode.svg",
      dark: "/viteplay-logo-wordmark-darkmode.svg",
    },
    siteTitle: false,
    editLink: {
      pattern: "https://github.com/viteplay/viteplay/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    socialLinks: [{ icon: "github", link: "https://github.com/viteplay/viteplay" }],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "My First Component", link: "/guide/my-first-component" },
          { text: "Customize Example", link: "/guide/customize-example" },
          { text: "Customize Iframe", link: "/guide/customize-iframe" },
        ],
      },
      {
        text: "About",
        items: [
          {
            text: "Design Goals, Motivation & Team",
            link: "/about/design-goals-motivation-and-team",
          },
        ],
      },
    ],

    footer: {
      message: "Made with 💛 by Mesqueeb & EGOIST",
      copyright: "MIT Licensed. Copyright © 2019-present",
    },
  },
})
