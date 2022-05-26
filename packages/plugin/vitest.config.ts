import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    deps: {
      // case-anything's umd bundle doesn't work with vitest
      // it throws __vite_ssr_import_5__.camelCase is not a function
      inline: ["case-anything"],
    },
  },
})
