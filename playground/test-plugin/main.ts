import "@viteplay/vue/dist/style.css"
import "./css/app.css"
import { createApp } from "vue"
import { router } from "./router"
import App from "./components/App.vue"

createApp(App).use(router).mount("#app")
