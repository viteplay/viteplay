import { localRequire } from "./utils"

/**
 * Get imported modules from a Vue file
 */
export const getImports = async (
  contents: string,
  file: string,
): Promise<{ imported: string; source: string }[]> => {
  const compiler: typeof import("vue/compiler-sfc") = localRequire("vue/compiler-sfc")
  const sfc = compiler.parse(contents, { filename: file })

  if (!sfc.descriptor.script && !sfc.descriptor.scriptSetup) {
    return []
  }

  const scriptResult = compiler.compileScript(sfc.descriptor, {
    id: "foo",
    sourceMap: false,
  })

  return Object.values(scriptResult.imports ?? {})
}
