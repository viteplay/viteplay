import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import pkg from "./package.json"

export default defineConfig((ctx) => {
  const prod = ctx.mode !== "development"
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
