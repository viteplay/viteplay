<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useMediaQuery } from "@vueuse/core"
import { SideBarItem } from "./components/SideBar.types"
import { elOrParentsHaveClass } from "./utils"
import SideBar from "./components/SideBar.vue"
import PageLayout from "./components/PageLayout.vue"
import NavBar from "./components/NavBar.vue"
import { useConfig } from "."

defineProps<{ items: SideBarItem[] }>()

// sidebar
const openSideBar = ref(false)

function toggleSideBar(to?: boolean) {
  openSideBar.value = typeof to === "boolean" ? to : !openSideBar.value
}

function maybeCloseSideBar(e: MouseEvent | TouchEvent): void {
  if (!openSideBar.value) return
  const isOverlappingSideBar = !useMediaQuery(`(min-width: 768px)`).value
  if (!isOverlappingSideBar) return

  const targetShouldCloseSideBar = elOrParentsHaveClass(
    e.target,
    /viteplay-page|viteplay-navbar|sidebar-link-item/,
  )
  if (targetShouldCloseSideBar) openSideBar.value = false
}

watch(
  useMediaQuery(`(max-width: 768px)`),
  (isSmallScreen, wasSmallScreen) => {
    if (isSmallScreen === wasSmallScreen) return
    toggleSideBar(!isSmallScreen)
  },
  { immediate: true },
)

const route = useRoute()
const config = useConfig()
const isBase = computed(() => route.path === config.base)
</script>

<template>
  <div :class="`viteplay viteplay-layout ${isBase ? 'viteplay-base' : ''}`">
    <NavBar
      :items="items"
      @toggleSideBar="() => toggleSideBar()"
      @click="(e) => maybeCloseSideBar(e)"
    />

    <SideBar :items="items" :open="openSideBar" @click="(e) => maybeCloseSideBar(e)" />

    <PageLayout :sideBarOpen="openSideBar" @click="(e) => maybeCloseSideBar(e)" />
  </div>
</template>

<style lang="scss">
.viteplay-page > * {
  background-color: var(--viteplay-c-bg);
}
</style>
