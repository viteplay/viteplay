import { createRouter, createWebHistory } from "vue-router"
import { pages } from "vite-plugin-component-examples/client"

console.log(`%c 🛣`, "font-size: 2rem", `generatedRoutes → `, pages)

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./components/Manual.vue"),
    },
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
