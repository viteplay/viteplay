<script setup lang="ts">
import { withBase } from "./utils"

defineProps<{
  title: string
  pathParent: string
  logo: string
}>()
</script>

<template>
  <a
    class="nav-bar-title"
    :href="pathParent"
    :aria-label="`${title}, back to home`"
  >
    <img
      v-if="logo"
      class="logo"
      :src="withBase(pathParent, logo)"
      alt="Logo"
    />
    {{ title }}
  </a>
</template>

<style scoped>
.nav-bar-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--c-text);
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-bar-title:hover {
  text-decoration: none;
}

.logo {
  margin-right: 0.75rem;
  height: 1.3rem;
  vertical-align: bottom;
}
</style>
