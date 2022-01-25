<script lang="ts" setup>
import { ref } from "vue"
import { SideBarItem } from "./components/SideBar.types"
import SideBar from "./components/SideBar.vue"
import Page from "./components/Page.vue"
import NavBar from "./components/NavBar.vue"

const navTitle = "VitePlay"
const navLogo = "https://v3.vuejs.org/logo.png"

defineProps<{
  items: SideBarItem[]
  base: string
}>()

// sidebar
const openSideBar = ref(false)

const toggleSidebar = (to?: boolean) => {
  openSideBar.value = typeof to === "boolean" ? to : !openSideBar.value
}
</script>

<template>
  <NavBar
    :title="navTitle"
    :base="base"
    :logo="navLogo"
    @toggle="toggleSidebar"
  />

  <SideBar :items="items" :base="base" :open="openSideBar" />

  <Page />
</template>

<style></style>
