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

export type GlobalPlaygroundOptions = {
  modules?: Record<string, any>
}

export type { SideBarItem } from "./components/SideBar.types"

const PROVIDE_KEY = Symbol("for-viteplay")

// @viteplay/plugin uses this to provide global options for the playground component
export const providePlaygroundOptions = (
  app: App,
  options: GlobalPlaygroundOptions,
) => {
  app.provide(PROVIDE_KEY, options)
}

export const usePlaygroundOptions = () => {
  const options = inject<GlobalPlaygroundOptions>(PROVIDE_KEY, {})
  return options
}
