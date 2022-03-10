import { localRequire } from "./utils"

type Parsed = {
  imports: { imported: string; source: string }[]
  docs: string
  darkExample?: boolean
  component: string
}

const DOCS_BLOCK_WITH_DARK_EXAMPLE_RE = /<docs\s+(darkExample|dark-example)\s*\/?>(<\/docs>)?/

export const parseExample = async (contents: string, file: string): Promise<Parsed> => {
  const compiler: typeof import("vue/compiler-sfc") = localRequire("vue/compiler-sfc")
  const sfc = compiler.parse(contents, { filename: file })
  const result: Parsed = { imports: [], docs: "", component: contents }

  if (sfc.descriptor.script || sfc.descriptor.scriptSetup) {
    const scriptResult = compiler.compileScript(sfc.descriptor, {
      id: "foo",
      sourceMap: false,
    })

    const dynamicImports: { imported: string; source: string }[] = []
    const extractDynamicImports = (ast?: any) => {
      if (!ast) return
      compiler.walk(ast, {
        // @ts-expect-error todo
        enter(node) {
          if (node.type === "CallExpression" && node.callee.type === "Import") {
            const arg = node.arguments[0]
            if (arg.type !== "StringLiteral") {
              throw new Error(`Expected string literal for import, got ${arg.type}`)
            }
            dynamicImports.push({ imported: "*", source: arg.value })
          }
        },
      })
    }
    extractDynamicImports(scriptResult.scriptSetupAst)
    extractDynamicImports(scriptResult.scriptAst)

    result.imports = [...Object.values(scriptResult.imports ?? {}), ...dynamicImports]
  }

  // Blocks with empty content will not be collected by vue compiler
  const docsBlock = sfc.descriptor.customBlocks.find((block) => block.type === "docs")
  if (docsBlock) {
    result.docs = docsBlock.content
    result.component = `${result.component.slice(
      0,
      docsBlock.loc.start.offset,
    )}${result.component.slice(docsBlock.loc.end.offset)}`.replace(/<docs[^>]*><\/docs>/, "")
    if (docsBlock.attrs.darkExample || docsBlock.attrs["dark-example"]) {
      result.darkExample = true
    }
  } else if (DOCS_BLOCK_WITH_DARK_EXAMPLE_RE.test(result.component)) {
    result.component = result.component.replace(DOCS_BLOCK_WITH_DARK_EXAMPLE_RE, "")
    result.darkExample = true
  }

  result.component = result.component.trim()
  return result
}
