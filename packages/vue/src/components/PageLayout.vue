<script setup lang="ts">
defineProps<{
  sideBarOpen: boolean
}>()
</script>

<template>
  <main :class="`page ${sideBarOpen ? 'side-bar-open' : ''}`">
    <div class="container">
      <!-- <slot name="top" /> -->

      <div class="content">
        <router-view />
      </div>
      <!-- <PageFooter /> -->
      <!-- <NextAndPrevLinks /> -->

      <!-- <slot name="bottom" /> -->
    </div>
  </main>
</template>

<style scoped>
.page {
  padding-top: var(--header-height);
  transition: margin-left 150ms ease-out;
}

@media (min-width: 720px) {
  .page.side-bar-open {
    margin-left: 16.4rem;
  }
}

@media (min-width: 960px) {
  .page.side-bar-open {
    margin-left: 20rem;
  }
}

.container {
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
  max-width: 48rem;
}

.content {
  position: relative;
  padding-bottom: 1.5rem;
}
</style>
