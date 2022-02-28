<script setup lang="ts">
import { useConfig } from ".."
import { withBase } from "./utils"

const config = useConfig()

const emit = defineEmits(["click"])
</script>

<template>
  <a
    class="navbar-title"
    :aria-label="`${config.title || 'VitePlay'}, show menu`"
    @click.prevent="() => emit('click')"
  >
    <img v-if="config.logo" class="logo" :src="withBase(config.base, config.logo)" alt="Logo" />
    <span v-if="config.title">{{ config.title }}</span>
  </a>
</template>

<style scoped>
.navbar-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--c-text);
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
}

.navbar-title:hover {
  text-decoration: none;
}

.logo {
  margin-right: 0.75rem;
  height: 1.3rem;
  vertical-align: bottom;
}
</style>
