import DefaultTheme from "vitepress/theme"
import { Playground } from "vue-playground"
import "vue-playground/dist/style.css"
import "prismjs/themes/prism-tomorrow.css"
import Button from "../../components/Button.vue"

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component("Playground", Playground)
    app.component("Button", Button)
  },
}
