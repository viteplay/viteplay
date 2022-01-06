import DefaultTheme from "vitepress/theme"
import { Repl } from "vue-repl"
import "vue-repl/dist/style.css"
import "prismjs/themes/prism-tomorrow.css"
import Button from "../../components/Button.vue"

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component("Playground", Repl)
    app.component("Button", Button)
  },
}
