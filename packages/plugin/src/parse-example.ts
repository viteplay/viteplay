import { Node } from "@babel/types"
import { camelCaseKeys, getEmptyDocsBlock, localRequire } from "./utils"

type Parsed = {
  imports: { importDefault?: boolean; source: string }[]
  docs: {
    attrs: Record<string, any>
    content: string
  }
  component: string
}

export const parseExample = async (contents: string, file: string): Promise<Parsed> => {
  const compiler: typeof import("vue/compiler-sfc") = localRequire("vue/compiler-sfc")
  const sfc = compiler.parse(contents, { filename: file })
  const result: Parsed = { imports: [], docs: { attrs: {}, content: "" }, component: contents }

  if (sfc.descriptor.script || sfc.descriptor.scriptSetup) {
    const scriptResult = compiler.compileScript(sfc.descriptor, {
      id: "foo",
      sourceMap: false,
    })

    const imports: { importDefault?: boolean; source: string }[] = []
    const extractImports = (ast?: any) => {
      if (!ast) return
      compiler.walk(ast, {
        enter(node: Node) {
          if (node.type === "CallExpression" && node.callee.type === "Import") {
            const arg = node.arguments[0]
            if (arg.type !== "StringLiteral") {
              throw new Error(`Expected string literal for import, got ${arg.type}`)
            }
            imports.push({ source: arg.value })
          } else if (node.type === "ImportDeclaration") {
            for (const spec of node.specifiers) {
              imports.push({
                importDefault: spec.type === "ImportDefaultSpecifier",
                source: node.source.value,
              })
            }
          }
        },
      })
    }
    extractImports(scriptResult.scriptSetupAst)
    extractImports(scriptResult.scriptAst)

    result.imports = imports
  }

  // Blocks with empty content will not be collected by vue compiler
  const docsBlock = sfc.descriptor.customBlocks.find((block) => block.type === "docs")
  if (docsBlock) {
    result.docs.content = docsBlock.content
    result.component = `${result.component.slice(
      0,
      docsBlock.loc.start.offset,
    )}${result.component.slice(docsBlock.loc.end.offset)}`.replace(/<docs[^>]*><\/docs>/, "")
    result.docs.attrs = camelCaseKeys(docsBlock.attrs)
  } else {
    const emptyDocs = getEmptyDocsBlock(result.component)
    if (emptyDocs) {
      result.component = emptyDocs.component
      result.docs.attrs = emptyDocs.attrs
    }
  }

  result.component = result.component.trim()
  return result
}
