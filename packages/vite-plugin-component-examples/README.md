# vite-plugin-component-examples

## Shorthand version

```ts
import { defineConfig } from "vite"
import componentExamples from "vite-plugin-component-examples"

export default defineConfig({
  plugins: [
    componentExamples({
      // Path to extract components from to create dev pages for
      components: "./components/*/*.vue",
      // Path to extract component examples from to put on each dev page
      componentExamples: "./components/*/*.example.vue",
    }),
  ],
})
```

Then it will generate pages from the examples, you can import the pages like this:

```js
import { pages } from "vite-plugin-component-examples/client"

assert.equal(pages, [
  {
    title: "Button",
    path: "/button",
    component: () => import("generated/pages/button.vue"),
  },
  {
    title: "Form",
    path: "/form",
    component: () => import("generated/pages/form.vue"),
  },
])
```

## Longhand version

```ts
import { defineConfig } from "vite"
import componentExamples from "vite-plugin-component-examples"

export default defineConfig({
  plugins: [
    componentExamples({
      pages: [
        {
          title: "Button",
          examples: "./button/*.example.vue",
        },
        {
          title: "Form",
          examples: "./form/*.example.vue",
        },
      ],
    }),
  ],
})
```

Then it will generate pages from the examples, you can import the pages like this:

```js
import { pages } from "vite-plugin-component-examples/client"

assert.equal(pages, [
  {
    title: "Button",
    path: "/button",
    component: () => import("generated/pages/button.vue"),
  },
  {
    title: "Form",
    path: "/form",
    component: () => import("generated/pages/form.vue"),
  },
])
```
