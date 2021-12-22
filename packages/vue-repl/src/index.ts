import "vue-prism-editor/dist/prismeditor.min.css"
import "./css/style.css"
import { App, inject } from "vue"

import Repl from "./Repl.vue"

export { Repl }

export { highlight } from "./highlight"

export type Options = {
  modules?: Record<string, any>
}

const PROVIDE_KEY = Symbol("for-vue-repl")

export const createReplContext = (options: Options = {}) => {
  return {
    install(app: App) {
      app.provide(PROVIDE_KEY, options)
    },
  }
}

export const useReplContext = () => {
  const options = inject<Options>(PROVIDE_KEY, {})
  return options
}
