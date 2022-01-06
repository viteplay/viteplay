// @ts-check
// sucrase is problematic with vitest so we bundle it here

import path from "path"
import fs from "fs"
import { build } from "esbuild"

/**
 * @param {string} file
 * @param {string} contents
 */
const outputFile = (file, contents) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents)
}

async function main() {
  await build({
    stdin: {
      contents: `export * from 'sucrase'`,
      resolveDir: process.cwd(),
      loader: "js",
      sourcefile: "sucrase.mjs",
    },
    mainFields: ["module", "main"],
    resolveExtensions: [".mjs", ".js"],
    bundle: true,
    format: "esm",
    outfile: "./vendor/sucrase.js",
  })

  outputFile("./vendor/sucrase.d.ts", 'export * from "sucrase"')
}

main()
