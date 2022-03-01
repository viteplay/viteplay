<script lang="ts" setup>
import { ref, watch } from "vue"
import { useMediaQuery } from "@vueuse/core"
import { SideBarItem } from "./components/SideBar.types"
import SideBar from "./components/SideBar.vue"
import PageLayout from "./components/PageLayout.vue"
import NavBar from "./components/NavBar.vue"

defineProps<{
  items: SideBarItem[]
}>()

// sidebar
const openSideBar = ref(false)

const toggleSidebar = (to?: boolean) => {
  openSideBar.value = typeof to === "boolean" ? to : !openSideBar.value
}

watch(
  useMediaQuery(`(max-width: 768px)`),
  (isSmallScreen, wasSmallScreen) => {
    if (isSmallScreen === wasSmallScreen) return
    toggleSidebar(!isSmallScreen)
  },
  { immediate: true },
)
</script>

<template>
  <NavBar :items="items" @toggle="toggleSidebar" />

  <SideBar :items="items" :open="openSideBar" />

  <PageLayout :sideBarOpen="openSideBar" />
</template>
