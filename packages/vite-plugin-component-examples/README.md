# vite-plugin-component-examples

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
