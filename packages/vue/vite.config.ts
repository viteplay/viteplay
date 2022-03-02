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
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
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
