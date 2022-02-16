// Parse component to get props definition

import { PropDefinition } from "@viteplay/types"
import { localRequire } from "./utils"

type Parsed = {
  props: PropDefinition[]
}

const inferTsTypeFromIdentifier = (identifier: string): PropDefinition["type"] => {
  switch (identifier) {
    case "String":
      return "string"
    case "Number":
      return "number"
    case "Boolean":
      return "boolean"
    case "Object":
      return "object"
    case "Array":
      return "array"
    default:
      return identifier
  }
}

const getDescFromComments = (comments?: any[]) => {
  return comments
    ? comments
        .map((c: any) => c.value)
        .join("\n")
        .replace(/^\*/, "")
        .replace(/^\s+\*\s+/gm, "")
        .trim()
    : ""
}

export const parseComponent = (contents: string, file: string): Parsed => {
  const compiler: typeof import("vue/compiler-sfc") = localRequire("vue/compiler-sfc")
  const sfc = compiler.parse(contents, { filename: file })
  const { scriptSetup } = sfc.descriptor

  const props: PropDefinition[] = []

  if (scriptSetup) {
    const ast = compiler.babelParse(scriptSetup.content, {
      sourceFilename: file,
      plugins: ["typescript"],
      sourceType: "module",
    })
    compiler.walk(ast, {
      enter(node: any) {
        if (node.type === "CallExpression" && node.callee.name === "defineProps") {
          const typeParam = node.typeParameters?.params[0]
          const firstArg = node.arguments && node.arguments[0]
          if (typeParam) {
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
                desc: getDescFromComments(member.leadingComments),
                required: !member.optional,
              })
            }
          } else if (firstArg && firstArg.type === "ObjectExpression") {
            for (const prop of firstArg.properties) {
              const name = prop.key.name
              let type: PropDefinition["type"] = "any"
              let required = false
              const desc = getDescFromComments(prop.leadingComments)

              if (prop.value.type === "Identifier") {
                type = inferTsTypeFromIdentifier(prop.value.name)
              } else if (prop.value.type === "ObjectExpression") {
                for (const item of prop.value.properties) {
                  if (item.key.name === "type") {
                    type = inferTsTypeFromIdentifier(item.value.name)
                  } else if (item.key.name === "required") {
                    required = item.value.value === true
                  }
                }
              }

              props.push({
                name,
                type,
                required,
                desc,
              })
            }
          }
        }
      },
    })
  }

  return {
    props,
  }
}
