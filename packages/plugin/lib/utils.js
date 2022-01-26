import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import process from "node:process"
import glob from "fast-glob"

/**
 *
 * @param {string} id
 */
export const localRequire = (id) => {
  const require = createRequire(import.meta.url)
  const resolved = require.resolve(id, { paths: [process.cwd()] })
  return require(resolved)
}

/**
 *
 * @param {string} url
 */
export const getDirnameFromImportMetaUrl = (url) => {
  const p = fileURLToPath(url)
  return path.dirname(p)
}

/**
 * @type {import('../').GetPagesFromOptions}
 */
export async function getPagesFromOptions(options) {
  if (options.pages) {
    return options.pages
  }

  const { components, componentExamples } = options

  if (!components || !componentExamples) {
    throw new Error(
      "You must provide both `components` and `componentExamples` in `options`",
    )
  }

  const exampleFiles = await glob(componentExamples)
  const files = await glob(components)
  const componentFiles = files.filter((p) => !exampleFiles.includes(p))

  return componentFiles.map((p) => {
    const fileName = (p.split("/").pop() ?? "").replace(/\.vue$/, "")
    const folder = path.dirname(p)
    const examples = exampleFiles.filter((_p) => _p.startsWith(folder))
    return { title: fileName, examples }
  })
}
