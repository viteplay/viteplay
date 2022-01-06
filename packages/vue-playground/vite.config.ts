import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
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
  plugins: [
    vue(),
    dts({
      skipDiagnostics: false,
      include: ["./src/**/*"],
      cleanVueFileName: true,
      beforeWriteFile(filepath) {
        return {
          filePath: filepath.replace("/dist/src/", "/dist/"),
        }
      },
    }),
  ],
})
