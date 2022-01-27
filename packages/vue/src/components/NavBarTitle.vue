<script setup lang="ts">
import { useConfig } from ".."
import { withBase } from "./utils"

const config = useConfig()
</script>

<template>
  <a class="nav-bar-title" :href="config.base" :aria-label="`${config.title}, back to home`">
    <img v-if="config.logo" class="logo" :src="withBase(config.base, config.logo)" alt="Logo" />
    {{ config.title }}
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
