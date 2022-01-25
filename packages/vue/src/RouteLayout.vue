<script lang="ts" setup>
import { ref } from "vue"
import { SideBarItem } from "./components/SideBar.types"
import SideBar from "./components/SideBar.vue"
import Page from "./components/Page.vue"
import NavBar from "./components/NavBar.vue"

defineProps<{
  items: SideBarItem[]
}>()

// sidebar
const openSideBar = ref(false)

const toggleSidebar = (to?: boolean) => {
  openSideBar.value = typeof to === "boolean" ? to : !openSideBar.value
}
</script>

<template>
  <NavBar @toggle="toggleSidebar" />

  <SideBar :items="items" :open="openSideBar" />

  <Page />
</template>

<style></style>
