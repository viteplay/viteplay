---
editLink: true
---

# Getting Started

## Requirements

Viteplay only available for **Vite projects**.

It currently only supports **Vue** based projects, but in the future we plan to support _React_ & _Svelte_ as well. (Maintainers welcome!)

## Setup

### Vue Projects

You only need to add 2 snippets of code to your vite and vue-router config.

#### Vite Config

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

This will auto-detect all your nested components in the `components` folder. (see [below](#configuring-components-paths) for more examples on different folder structures)

#### Vue Router

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

That's all! Now you have a fully auto-generated development environment for your components. Just visit `/dev` on your localhost server and start writing [component examples](/writing-component-examples)!

### Config Examples

#### Component Auto-Detection

Here is a table with some common use setup examples for auto-detecting components in your project.

| folder setup                     | viteplay config                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| TODO: show folder structure here | `components: "./components/*/*.vue",`<br />`componentExamples: "./components/*/examples/*.vue",` |
| TODO: show folder structure here | `components: "./components/*/*.vue",`<br />`componentExamples: "./components/*/*.example.vue",`  |

#### Only Show Specific Components

Instead of auto-detecting components, you can also configure VitePlay to only show specific components/examples on the dev page.

```ts
// vite.config.ts (.js)
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import viteplay from "@viteplay/plugin"

export default defineConfig({
  plugins: [
    vue(),
    viteplay({
      pages: [
        {
          title: "MyButton", // (Optional) defaults to the component name
          component: "./button/MyButton.vue",
          examples: "./button/*.example.vue",
        },
        {
          title: "MyForm", // (Optional) defaults to the component name
          component: "./form/MyForm.vue",
          examples: "./form/*.example.vue",
        },
      ],
      // base route for the development pages
      base: "/dev",
    }),
  ],
})
```
