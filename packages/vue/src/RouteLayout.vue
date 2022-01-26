<script lang="ts" setup>
import { watch, onMounted, ref } from "vue"
import { SideBarItem } from "./components/SideBar.types"
import SideBar from "./components/SideBar.vue"
import PageLayout from "./components/PageLayout.vue"
import NavBar from "./components/NavBar.vue"
import { useRoute } from "vue-router"

defineProps<{
  items: SideBarItem[]
}>()

// sidebar
const openSideBar = ref(false)

const toggleSidebar = (to?: boolean) => {
  openSideBar.value = typeof to === "boolean" ? to : !openSideBar.value
}

const route = useRoute()

const scrollTo = (hash: string) => {
  try {
    const el =
      hash && document.querySelector<HTMLElement>(decodeURIComponent(hash))
    if (el) {
      setTimeout(() => {
        window.scrollTo({
          top: el.offsetTop,
        })
      })
    }
  } catch (err) {}
}

onMounted(() => {
  scrollTo(route.hash)
})

watch(
  () => [route.hash],
  () => {
    scrollTo(route.hash)
  },
)
</script>

<template>
  <NavBar @toggle="toggleSidebar" />

  <SideBar
    :items="items"
    :open="openSideBar"
  />

  <PageLayout />
</template>
