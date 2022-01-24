import "vue-prism-editor/dist/prismeditor.min.css"
import "./css/vars.css"
import "./css/layout.css"
import "./css/sidebar-links.css"
import "./css/style.css"
import { App, inject } from "vue"

import Playground from "./Playground.vue"
import RouteLayout from "./RouteLayout.vue"

export { Playground, RouteLayout }

export { highlight } from "./highlight"

export type Options = {
  modules?: Record<string, any>
}

export type { SideBarItem } from "./components/SideBar.types"

const PROVIDE_KEY = Symbol("for-viteplay")

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
