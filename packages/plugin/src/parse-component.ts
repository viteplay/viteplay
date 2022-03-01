// Parse component to get props definition
import { createRequire } from "node:module"
import { PropDefinition } from "@viteplay/types"
import { Node, Comment } from "@babel/types"
import { localRequire } from "./utils"

const require = createRequire(import.meta.url)

const generator: typeof import("@babel/generator") = require("@babel/generator")

type Parsed = {
  props: PropDefinition[]
}

const inferTsType = (node: Node): string => {
  if (node.type === "Identifier") {
    switch (node.name) {
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
        return node.name
    }
  } else if (node.type === "TSAsExpression") {
    return generateCodeFromTypeAnnotation(node.typeAnnotation, "foo.ts")
  } else if (node.type === "ArrayExpression") {
    return node.elements
      .map((node) => (node ? inferTsType(node) : null))
      .filter(Boolean)
      .join(" | ")
  }

  return "unknown"
}

const getDescFromComments = (comments?: readonly Comment[] | null) => {
  return comments
    ? comments
        .map((c) => c.value)
        .join("\n")
        .replace(/^\*/, "")
        .replace(/^\s+\*\s+/gm, "")
        .trim()
    : ""
}

const generateCodeFromTypeAnnotation = (node: Node, file: string) => {
  return generator.default(node, {
    sourceFileName: file,
  }).code
}

export const parseComponent = async (contents: string, file: string): Promise<Parsed> => {
  const compiler: typeof import("vue/compiler-sfc") = localRequire("vue/compiler-sfc")
  const sfc = compiler.parse(contents, { filename: file })
  const { scriptSetup, script } = sfc.descriptor

  const props: PropDefinition[] = []

  const extractPropsFromPropsObject = (node: Node) => {
    if (node.type !== "ObjectExpression") return

    for (const prop of node.properties) {
      if (prop.type !== "ObjectProperty" || prop.key.type !== "Identifier") continue

      const name = prop.key.name
      let type: PropDefinition["type"] = "any"
      let required = false
      const desc = getDescFromComments(prop.leadingComments)

      // propName: String | Number etc
      if (prop.value.type === "Identifier") {
        type = inferTsType(prop.value)
      } else if (prop.value.type === "ObjectExpression") {
        // propName: { type: String, required: true }
        for (const item of prop.value.properties) {
          if (item.type === "ObjectProperty" && item.key.type === "Identifier") {
            if (item.key.name === "type") {
              type = inferTsType(item.value)
            } else if (item.key.name === "required" && item.value.type === "BooleanLiteral") {
              required = item.value.value === true
            }
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

  const parse = (code: string) => {
    const ast = compiler.babelParse(code, {
      sourceFilename: file,
      plugins: ["typescript"],
      sourceType: "module",
    })

    compiler.walk(ast, {
      enter(node: Node) {
        if (
          node.type === "CallExpression" &&
          node.callee.type === "Identifier" &&
          node.callee.name === "defineProps"
        ) {
          this.skip()
          const typeParam = node.typeParameters?.params[0]
          const firstArg = node.arguments && node.arguments[0]
          // defineProps with type parameter
          if (typeParam?.type === "TSTypeLiteral") {
            for (const member of typeParam.members) {
              if (
                member.type === "TSPropertySignature" &&
                member.key.type === "Identifier" &&
                member.typeAnnotation
              ) {
                props.push({
                  name: member.key.name,
                  type: generateCodeFromTypeAnnotation(member.typeAnnotation.typeAnnotation, file),
                  desc: getDescFromComments(member.leadingComments),
                  required: !member.optional,
                })
              }
            }
          }
          // defineProps with props object
          else if (firstArg && firstArg.type === "ObjectExpression") {
            extractPropsFromPropsObject(firstArg)
          }
        }

        // defineComponent with props object
        if (
          node.type === "CallExpression" &&
          node.callee.type === "Identifier" &&
          node.callee.name === "defineComponent"
        ) {
          this.skip()
          const arg = node.arguments[0]
          if (arg && arg.type === "ObjectExpression") {
            const property = arg.properties[0]
            if (
              property &&
              property.type === "ObjectProperty" &&
              property.key.type === "Identifier" &&
              property.key.name === "props"
            ) {
              extractPropsFromPropsObject(property.value)
            }
          }
        }
      },
    })
  }

  if (scriptSetup) {
    parse(scriptSetup.content)
  } else if (script) {
    parse(script.content)
  }

  return {
    props,
  }
}
