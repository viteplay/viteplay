import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import pkg from "./package.json"

export default defineConfig((ctx) => {
  return {
    build: {
      minify: false,
      emptyOutDir: false,
      lib: {
        entry: "./src/index.ts",
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        output: [
          {
            assetFileNames: "style.[ext]",
            entryFileNames: "index.mjs",
            chunkFileNames: "index.mjs",
            format: "es",
          },
          {
            assetFileNames: "style.[ext]",
            entryFileNames: "index.js",
            chunkFileNames: "index.js",
            format: "cjs",
          },
        ],
        external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
      },
    },
    plugins: [vue()],
  }
})
