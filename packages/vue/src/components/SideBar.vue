<script setup lang="ts">
import { SideBarItem } from "./SideBar.types"
import SideBarLinks from "./SideBarLinks.vue"

defineProps<{ open: boolean; items: SideBarItem[] }>()
</script>

<template>
  <aside class="viteplay-sidebar" :class="{ open }">
    <!-- <NavLinks class="nav" /> -->

    <!-- <slot name="sidebar-top" /> -->

    <SideBarLinks :items="items" />

    <!-- <slot name="sidebar-bottom" /> -->
  </aside>
</template>

<style lang="scss">
.viteplay-sidebar {
  position: fixed;
  top: var(--viteplay-header-height);
  bottom: 0;
  left: 0;
  z-index: var(--viteplay-z-index-sidebar);
  border-right: 1px solid var(--viteplay-c-divider);
  width: 16.4rem;
  background-color: var(--viteplay-c-bg);
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
}

@media (min-width: 960px) {
  .viteplay-sidebar {
    width: 20rem;
  }
}

.viteplay-sidebar.open {
  transform: translateX(0);
}
</style>
