import { defineConfig } from "vitepress"

export default defineConfig({
  lang: "en-US",
  title: " ",
  description: "Automated Component Development Environment",
  markdown: {
    // options for markdown-it-toc
    toc: { includeLevel: [1, 2] },
  },
  themeConfig: {
    logo: "/viteplay-logo.svg",
    repo: "viteplay/viteplay",

    docsBranch: "main",
    editLinks: true,
    editLinkText: "Edit this page on GitHub",
    lastUpdated: "Last Updated",

    sidebar: [
      {
        text: "Guide",
        children: [
          {
            text: "Getting Started",
            link: "/docs/getting-started",
          },
          {
            text: "Customize Example",
            link: "/docs/customize-example",
          },
          {
            text: "Customize Iframe",
            link: "/docs/customize-iframe",
          },
        ],
      },
    ],

    // algolia: {
    //   apiKey: "",
    //   appId: "",
    //   indexName: "",
    // },

    nav: [
      {
        text: "Release Notes",
        link: "https://github.com/viteplay/viteplay/blob/main/CHANGELOG.md",
      },
    ],
  },
})
