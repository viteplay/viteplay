<script setup lang="ts">
import { SideBarItem } from "./SideBar.types"
import { SideBarLink } from "./SideBarLink"

defineProps<{ items: SideBarItem[] }>()
</script>

<template>
  <ul
    v-if="items.length > 0"
    class="sidebar-links"
  >
    <SideBarLink
      v-for="(item, index) of items"
      :key="index"
      :item="item"
    />
  </ul>
</template>
