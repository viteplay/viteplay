import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import viteplay from "@viteplay/plugin"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    vue(),
    viteplay({
      // Path to extract components from to create dev pages for
      components: "./components/*/*.vue",
      // Path to extract component examples from to put on each dev page
      componentExamples: "./components/*/examples/*.vue",
      base: "/dev",
    }),
    tsconfigPaths({
      loose: true,
    }),
  ],
})
