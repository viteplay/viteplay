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
