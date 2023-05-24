<script lang="ts" setup>
import { PopMenu } from "@pepicons/vue"
const emit = defineEmits<{ (e: "toggle"): void }>()
</script>

<template>
  <PopMenu class="sidebar-button" @click.stop="() => emit('toggle')" />
</template>

<style lang="scss">
.sidebar-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0.2rem;
  line-height: 0;
  user-select: none;
  color: var(--viteplay-c-text);
}
</style>
