import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import pkg from "./package.json"

export default defineConfig((ctx) => {
  return {
    build: {
      minify: false,
      emptyOutDir: false,
      lib: {
        entry: "./src/iframe/index.ts",
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        output: [
          {
            assetFileNames: "style.iframe.[ext]",
            entryFileNames: "iframe/index.mjs",
            chunkFileNames: "iframe/index.mjs",
            format: "es",
          },
          {
            assetFileNames: "style.iframe.[ext]",
            entryFileNames: "iframe/index.js",
            chunkFileNames: "iframe/index.js",
            format: "cjs",
          },
        ],
        external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
      },
    },
    plugins: [vue()],
  }
})
