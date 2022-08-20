import { createRouter, createWebHistory } from "vue-router"
import { pages as pagesVitePlay } from "@viteplay/vue/client"
import "@viteplay/vue/dist/style.css"

console.log(`VitePlay routes for development → `, pagesVitePlay)

export const router = createRouter({
  history: createWebHistory(), // or whatever your project has already
  routes: [
    ...pagesVitePlay,
    // your other routes here...
  ],
})
