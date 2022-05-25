import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import pkg from "./package.json"

export default defineConfig((ctx) => {
  const prod = ctx.mode !== "development"
  return {
    build: {
      emptyOutDir: prod,
      lib: {
        entry: "./src/index.ts",
        formats: ["cjs", "es"],
      },
      rollupOptions: {
        input: {
          index: "./src/index.ts",
          iframe: "./src/iframe/index.ts",
        },
        output: [
          {
            entryFileNames: "[name].mjs",
            chunkFileNames: "[name].mjs",
            format: "esm",
          },
          {
            entryFileNames: "[name].js",
            chunkFileNames: "[name].js",
            format: "cjs",
          },
        ],
        external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
      },
    },
    plugins: [
      vue(),
      prod &&
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
  }
})
