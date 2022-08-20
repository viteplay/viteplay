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
        entry: "./src/iframe/index.ts",
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        output: [
          {
            assetFileNames: "style.iframe.[ext]",
            entryFileNames: "iframe.mjs",
            chunkFileNames: "iframe.mjs",
            format: "es",
          },
          {
            assetFileNames: "style.iframe.[ext]",
            entryFileNames: "iframe.js",
            chunkFileNames: "iframe.js",
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
