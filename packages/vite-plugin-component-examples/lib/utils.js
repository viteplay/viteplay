import path from "path"
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
