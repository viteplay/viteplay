import { defineConfig } from "vitepress"

export default defineConfig({
  lang: "en-US",
  title: "VitePlay",
  description: "Fully Automated Component Development Environment",
  markdown: {
    // options for markdown-it-toc
    toc: { includeLevel: [1, 2] },
  },
  themeConfig: {
    logo: "/Logo.svg",
    repo: "viteplay/viteplay",

    docsBranch: "main",
    editLinks: true,
    editLinkText: "Edit this page on GitHub",
    lastUpdated: "Last Updated",

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
