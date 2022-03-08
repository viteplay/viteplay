<script setup lang="ts">
import { useConfig } from ".."
import { withBase } from "./utils"

const config = useConfig()
</script>

<template>
  <router-link
    class="navbar-title"
    :to="config.base"
    :aria-label="`${config.title || 'VitePlay'}, back to home`"
  >
    <img
      v-if="!config.logo"
      class="logo"
      src="../../../../assets/logo.svg"
      alt="Logo"
      :draggable="false"
    />
    <img
      v-if="config.logo"
      class="logo"
      :src="withBase(config.base, config.logo)"
      alt="Logo"
      :draggable="false"
    />
    <span v-if="config.title">{{ config.title }}</span>
  </router-link>
</template>

<style scoped lang="scss">
.navbar-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--c-text);
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
}

.navbar-title:hover {
  text-decoration: none;
}

.logo {
  height: 1.3rem;
  vertical-align: bottom;
  user-select: none;
}
</style>
