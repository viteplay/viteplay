import path from "path"
import glob from "fast-glob"
import { createRequire } from "module"
import { fileURLToPath } from "url"

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
 * @param {import('../../index').Options} options
 * @returns {import('../../index').Page[]}
 */
export async function getPagesFromOptions(options) {
  if ("pages" in options) return options.pages

  const { components, componentExamples } = options
  const exampleFiles = await glob(componentExamples)
  const files = await glob(components)
  const componentFiles = files.filter((p) => !exampleFiles.includes(p))

  return componentFiles.map((p) => {
    const componentFile = (p.split("/").pop() || "").replace(/\.vue$/, "")
    const componentFolder = p.split("/").slice(0, -1).join("/")
    const examples = exampleFiles.filter((_p) => _p.startsWith(componentFolder))
    return { title: componentFile, examples }
  })
}
