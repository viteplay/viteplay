<script setup lang="ts">
import NavBarTitle from "./NavBarTitle.vue"
import ToggleSideBarButton from "./ToggleSideBarButton.vue"

const emit = defineEmits<{
  (e: "toggle"): void
}>()
</script>

<template>
  <header class="navbar">
    <ToggleSideBarButton @toggle="emit('toggle')" />

    <NavBarTitle />

    <div class="flex-grow" />
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--z-index-navbar);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--c-divider);
  padding: 0.7rem 1.5rem 0.7rem 4rem;
  height: var(--header-height);
  background-color: var(--c-bg);
}

@media (min-width: 720px) {
  .navbar {
    padding: 0.7rem 1.5rem;
  }
}

.flex-grow {
  flex-grow: 1;
}
</style>
