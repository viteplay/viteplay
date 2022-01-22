import "vue-prism-editor/dist/prismeditor.min.css"
import "./css/style.css"
import { App, inject } from "vue"

import Playground from "./Playground.vue"
import ViteplayLayout from "./ViteplayLayout.vue"

export { Playground, ViteplayLayout }

export { highlight } from "./highlight"

export type Options = {
  modules?: Record<string, any>
}

const PROVIDE_KEY = Symbol("for-vue-playground")

export const createPlaygroundContext = (options: Options = {}) => {
  return {
    install(app: App) {
      app.provide(PROVIDE_KEY, options)
    },
  }
}

export const usePlaygroundContext = () => {
  const options = inject<Options>(PROVIDE_KEY, {})
  return options
}
