import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import pkg from "./package.json"

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies),
      ],
    },
  },
  plugins: [vue()],
})
