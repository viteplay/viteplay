<script setup lang="ts">
import { VTooltip as vTooltip } from "floating-vue"
import * as pepiconsVue from "@pepicons/vue"
const { Pepicon } = pepiconsVue

const props = defineProps<{
  title: string
  openInEditor?: () => void
}>()
</script>

<template>
  <h1 class="page-title">
    <span>{{ props.title }}</span
    ><Pepicon
      v-if="props.openInEditor"
      v-tooltip="`Open the component in editor`"
      name="open"
      aria-hidden="true"
      role="button"
      class="open-in-editor-button"
      @click="props.openInEditor"
    />
  </h1>
</template>

<style scoped lang="scss">
.page-title {
  display: flex;
}

.open-in-editor-button {
  margin-left: 5px;
  cursor: pointer;
  color: var(--viteplay-c-text-light-3);
}

.open-in-editor-button:hover {
  color: var(--viteplay-c-text-light-2);
}
</style>
