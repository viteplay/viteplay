// @ts-nocheck
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import componentExamples from "vite-plugin-component-examples"

export default defineConfig({
  plugins: [
    vue(),
    componentExamples({
      // Path to extract components from to create dev pages for
      components: "./components/*/*.vue",
      // Path to extract component examples from to put on each dev page
      componentExamples: "./components/*/*.example.vue",
      // pages: [
      //   {
      //     title: "Button",
      //     examples: "./components/button/*.example.vue",
      //   },
      //   {
      //     title: "Input",
      //     examples: "./components/input/*.example.vue",
      //   },
      // ],
    }),
  ],
})
