import { localRequire } from "./utils"

type Parsed = {
  imports: { imported: string; source: string }[]
  docs: string
  component: string
}

export const parseSFC = async (contents: string, file: string): Promise<Parsed> => {
  const compiler: typeof import("vue/compiler-sfc") = localRequire("vue/compiler-sfc")
  const sfc = compiler.parse(contents, { filename: file })
  const result: Parsed = { imports: [], docs: "", component: contents }

  if (!sfc.descriptor.script && !sfc.descriptor.scriptSetup) {
    return result
  }

  const scriptResult = compiler.compileScript(sfc.descriptor, {
    id: "foo",
    sourceMap: false,
  })

  result.imports = Object.values(scriptResult.imports ?? {})

  for (const block of sfc.descriptor.customBlocks) {
    if (block.type === "docs") {
      result.docs = block.content
      result.component = `${result.component.slice(
        0,
        block.loc.start.offset,
      )}${result.component.slice(block.loc.end.offset)}`.replace("<docs></docs>", "")
      break
    }
  }

  return result
}
