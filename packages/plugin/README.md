# @viteplay/plugin

## Setup

### Shorthand version

```ts
// vite.config.ts
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
      componentExamples: "./components/*/*.example.vue",
      // base route for the development pages
      base: "/dev",
    }),
  ],
})
```

### Longhand version

```ts
// vite.config.ts
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

### Add to Vue Router

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
