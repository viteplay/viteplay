<script setup lang="ts">
import { SideBarItem } from "./SideBar.types"
import { SideBarLink } from "./SideBarLink"

defineProps<{ items: SideBarItem[]; pathParent: string }>()
</script>

<template>
  <ul v-if="items.length > 0" class="sidebar-links">
    <SideBarLink v-for="item of items" :item="item" :pathParent="pathParent" />
  </ul>
</template>
