import "./css/vars.css"
import "./css/main.css"
import "./css/sidebar.css"
import { provide, inject } from "vue"

import Playground from "./Playground.vue"
import RouteLayout from "./RouteLayout.vue"
import PropsTable from "./components/PropsTable.vue"
import ExampleHeader from "./components/ExampleHeader.vue"
import PageTitle from "./components/PageTitle.vue"

export { Playground, RouteLayout, PropsTable, ExampleHeader, PageTitle }

export type Config = {
  modules?: Record<string, any>
  base?: string
  title?: string
  logo?: string
}

export type { SideBarItem } from "./components/SideBar.types"

const PROVIDE_KEY = Symbol("for-viteplay")

const getDefaultConfig = () => {
  return {
    base: "/",
    modules: {},
    title: "VitePlay",
    logo: "https://v2.vuejs.org/images/logo.png",
  }
}

// @viteplay/plugin uses this to provide global config
export const provideConfig = (config: Config) => {
  provide(PROVIDE_KEY, {
    ...getDefaultConfig(),
    ...config,
  })
}

export const useConfig = () => {
  const config = inject<Required<Config>>(PROVIDE_KEY, getDefaultConfig())
  return config
}
