import * as Vue from "vue"
import {
  parse,
  compileScript,
  compileTemplate,
  compileStyle,
} from "@vue/compiler-sfc"
import { transform, Transform } from "../vendor/sucrase"

export type Transformed = {
  component?: any
  css?: string
  errors?: string[]
}

export const transformCodeToComponent = (
  code: string,
  modules: Record<string, any> = {},
  filename = "preview.vue",
): Transformed => {
  const { descriptor, errors: parseErrors } = parse(code, {
    sourceMap: true,
    filename,
  })

  const errors: string[] = []

  if (errors.length > 0) {
    return { errors: parseErrors.map((e) => e.message) }
  }

  try {
    const id = `_${Math.random().toString(36).slice(2, 9)}`
    const component: Record<string, any> = {}
    let css = ""

    const require = (id: string) => {
      if (id in modules) {
        return modules[id]
      }
      if (id === "vue") {
        return Vue
      }
      throw new Error(`Module ${id} not found`)
    }

    const evalCode = (code: string, isTS: boolean) => {
      const result = transform(code, {
        transforms: [isTS && "typescript", "imports"].filter(
          Boolean,
        ) as Transform[],
      })
      const exports: Record<string, any> = {}
      const fn = new Function("require", "exports", result.code)
      fn(require, exports)
      return exports
    }
    const isTS =
      descriptor.script?.lang === "ts" || descriptor.scriptSetup?.lang === "ts"
    // Get the setup function from script setup, template is inlined in setup function
    const scriptResult = compileScript(descriptor, { id, inlineTemplate: true })

    const exports = evalCode(scriptResult.content, isTS)
    Object.assign(component, exports.default)

    // Compile template, only needed if there's no script setup
    if (!descriptor.scriptSetup && descriptor.template) {
      const templateResult = compileTemplate({
        source: descriptor.template.content,
        id,
        filename,
      })
      if (templateResult.errors.length > 0) {
        return {
          errors: templateResult.errors.map((e) =>
            typeof e === "string" ? e : e.message,
          ),
        }
      }
      const exports = evalCode(templateResult.code, false)
      Object.assign(component, exports)
    }

    for (const style of descriptor.styles) {
      const styleResult = compileStyle({
        source: style.content,
        id,
        filename,
        scoped: style.scoped,
      })
      if (styleResult.errors.length > 0) {
        return {
          errors: styleResult.errors.map((e: any) => {
            if (e.name === "CssSyntaxError") {
              return `${e.file}:${e.line + style.loc.start.line - 1}:${
                e.column
              }: ${e.reason}`
            }
            return e.message
          }),
        }
      }
      css += styleResult.code + "\n"
    }

    return { component, css, errors }
  } catch (error: any) {
    return { errors: [error.message] }
  }
}
