// @ts-check
import { localRequire } from "./utils.js"

/**
 * Get imported modules from a Vue file
 * @param {string} contents file contents
 * @param {string} file absolute path
 */
export const getImports = async (contents, file) => {
  /** @type {import('vue/compiler-sfc')} */
  const compiler = localRequire("vue/compiler-sfc")
  const sfc = compiler.parse(contents, { filename: file })

  const scriptResult = compiler.compileScript(sfc.descriptor, {
    id: "foo",
    sourceMap: false,
  })

  return Object.values(scriptResult.imports || {})
}
