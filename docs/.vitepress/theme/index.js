// .vitepress/theme/index.js
import { defineCustomElement } from "vue"
import DefaultTheme from "vitepress/theme"
import "./variables.css"
import "./styles.css"

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
  },
}
