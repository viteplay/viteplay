---
editLink: true
---

# Getting Started

## Requirements

Viteplay only available for **Vite projects**.

It currently only supports **Vue** based projects, but in the future we plan to support _React_ & _Svelte_ as well. (Maintainers welcome!)

## Setup

### Vue

You only need to add 2 snippets of code to your vite and vue-router config.

In `vite.config.ts` (or `.js`) add this:

```ts
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import viteplay from "@viteplay/plugin"

export default defineConfig({
  plugins: [
    vue(),
    viteplay({
      // Path to extract components from
      components: "./components/*/*.vue",
      // Path to extract examples from
      componentExamples: "./components/*/examples/*.vue",
      // base route for the development pages
      base: "/dev",
    }),
  ],
})
```

Add [Vue Router](https://router.vuejs.org) to your project if you haven't already.

In your Vue Router config file, add this:

```ts
import { createRouter } from "vue-router"
import { pages as pagesVitePlay } from "@viteplay/vue/client"

console.log(`VitePlay development routes → `, pagesVitePlay)

export const router = createRouter({
  routes: [
    ...pagesVitePlay,
    // your other routes here...
  ],
})
```
