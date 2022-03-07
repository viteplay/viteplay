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

const toggleSideBar = (to?: boolean, cause?: "blur") => {
  const isOverlappingSideBar = !useMediaQuery(`(min-width: 768px)`).value
  if (cause === "blur" && !isOverlappingSideBar) {
    // only close menu on blur if the menu is currently overlapping (anything smaller than (min-width: 768px)
    return
  }
  openSideBar.value = typeof to === "boolean" ? to : !openSideBar.value
}

watch(
  useMediaQuery(`(max-width: 768px)`),
  (isSmallScreen, wasSmallScreen) => {
    if (isSmallScreen === wasSmallScreen) return
    toggleSideBar(!isSmallScreen)
  },
  { immediate: true },
)
</script>

<template>
  <NavBar
    :items="items"
    @toggleSideBar="() => toggleSideBar()"
    @blurSideBarButton="() => toggleSideBar(false, 'blur')"
  />

  <SideBar :items="items" :open="openSideBar" />

  <PageLayout :sideBarOpen="openSideBar" />
</template>
