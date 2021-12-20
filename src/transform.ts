import * as Vue from "vue"
import { parse, compileScript } from "@vue/compiler-sfc"
import { transform, Transform } from "../vendor/sucrase"

export const transformCodeToComponent = (
  code: string,
  modules: Record<string, any> = {},
) => {
  const { descriptor, errors } = parse(code, {})
  const id = `_${Math.random().toString(36).slice(2, 9)}`

  if (errors.length > 0) {
    throw new Error(errors.join("\n"))
  }

  const component: Record<string, any> = {}

  const require = (id: string) => {
    if (id in modules) {
      return modules[id]
    }
    if (id === "vue") {
      return Vue
    }
    throw new Error(`Module ${id} not found`)
  }

  if (descriptor.script) {
    // TODO
  }

  // Get the setup function from script setup, template is inlined in setup function
  if (descriptor.scriptSetup) {
    const script = compileScript(descriptor, { id, inlineTemplate: true })
    const result = transform(script.content, {
      transforms: [script.lang === "ts" && "typescript", "imports"].filter(
        Boolean,
      ) as Transform[],
    })
    const exports: Record<string, any> = {}

    const fn = new Function("exports", "require", result.code)
    fn(exports, require)
    Object.assign(component, exports.default)
  }

  if (descriptor.styles.length > 0) {
    // TODO
  }

  return component
}
