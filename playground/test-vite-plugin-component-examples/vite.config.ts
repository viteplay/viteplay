import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import componentExamples from "vite-plugin-component-examples"

export default defineConfig({
  plugins: [
    vue(),
    componentExamples({
      pages: [
        {
          title: "Button",
          examples: "./components/button/*.example.vue",
        },
        {
          title: "Input",
          examples: "./components/input/*.example.vue",
        },
      ],
    }),
  ],
})
