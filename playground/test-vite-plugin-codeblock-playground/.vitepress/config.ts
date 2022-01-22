// @ts-nocheck
import { defineConfig } from "vitepress"
import VitePlay from "vite-plugin-codeblock-playground"

export default defineConfig({
  vite: {
    plugins: [VitePlay()],
  },
})
