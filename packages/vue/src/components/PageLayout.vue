<script setup lang="ts">
defineProps<{
  sideBarOpen: boolean
}>()
</script>

<template>
  <main :class="`viteplay-page ${sideBarOpen ? 'side-bar-open' : ''}`">
    <div class="viteplay-container">
      <!-- <slot name="top" /> -->

      <div class="viteplay-content">
        <router-view />
      </div>
      <!-- <PageFooter /> -->
      <!-- <NextAndPrevLinks /> -->

      <!-- <slot name="bottom" /> -->
    </div>
  </main>
</template>

<style scoped>
.viteplay-page {
  display: block;
  padding-top: var(--header-height);
  transition: margin-left 150ms ease-out;
}

@media (min-width: 768px) {
  .viteplay-page.side-bar-open {
    margin-left: 16.4rem;
  }
}

@media (min-width: 960px) {
  .viteplay-page.side-bar-open {
    margin-left: 20rem;
  }
}

.viteplay-container {
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
  max-width: 48rem;
}

.viteplay-content {
  position: relative;
  padding-bottom: 1.5rem;
}
</style>
