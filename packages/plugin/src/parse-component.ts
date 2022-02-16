// Parse component to get props definition

import { localRequire } from "./utils"

type Prop = {
  name: string
  desc: string
  type: "string" | "number" | "array" | "boolean" | "object" | "any"
  required?: boolean
}

type Parsed = {
  props: Prop[]
}

export const parseComponent = (contents: string, file: string): Parsed => {
  const compiler: typeof import("vue/compiler-sfc") = localRequire("vue/compiler-sfc")
  const sfc = compiler.parse(contents, { filename: file })
  const { scriptSetup } = sfc.descriptor

  const props: Prop[] = []

  if (scriptSetup) {
    const ast = compiler.babelParse(scriptSetup.content, {
      sourceFilename: file,
      plugins: ["typescript"],
      sourceType: "module",
    })
    compiler.walk(ast, {
      enter(node: any) {
        if (node.type === "CallExpression" && node.callee.name === "defineProps") {
          const typeParam = node.typeParameters.params[0]
          for (const member of typeParam.members) {
            const { type } = member.typeAnnotation.typeAnnotation
            props.push({
              name: member.key.name,
              type:
                type === "TSStringKeyword"
                  ? "string"
                  : type === "TSNumberKeyword"
                  ? "number"
                  : type === "TSBooleanKeyword"
                  ? "boolean"
                  : type === "TSTypeLiteral"
                  ? "object"
                  : type === "TSArrayType"
                  ? "array"
                  : "any",
              desc: member.leadingComments
                ? member.leadingComments
                    .map((c: any) => c.value)
                    .join("\n")
                    .replace(/^\*/, "")
                    .replace(/^\s+\*\s+/gm, "")
                    .trim()
                : "",
              required: !member.optional,
            })
          }
        }
      },
    })
  }

  return {
    props,
  }
}
