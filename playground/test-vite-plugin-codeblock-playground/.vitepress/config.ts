// @ts-nocheck
import { defineConfig } from "vitepress"
import playground from "vite-plugin-codeblock-playground"

export default defineConfig({
  vite: {
    plugins: [playground()],
  },
})
