import "floating-vue/dist/style.css"
import "./css/variables.css"
import "./css/main.scss"
import "./css/sidebar.scss"
import { provide, inject } from "vue"

import RouteLayout from "./RouteLayout.vue"
import PropsTable from "./components/PropsTable.vue"
import ExampleHeader from "./components/ExampleHeader.vue"
import PageTitle from "./components/PageTitle.vue"
import Example from "./components/Example.vue"

export { Example, RouteLayout, PropsTable, ExampleHeader, PageTitle }

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
    title: "",
    logo: "",
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
