import { createRouter, createWebHistory } from "vue-router"
import { pages } from "@viteplay/vue/client"

// Not in Iframe
if (window.parent === window) {
  console.log(`%c 🛣`, "font-size: 2rem", `generatedRoutes → `, pages)
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/my-page",
      component: () => import("./components/MyPage.vue"),
    },
    ...pages,
    {
      path: "/:all(.*)*",
      component: () => import("./components/404.vue"),
    },
  ],
})
