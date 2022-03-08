<script setup lang="ts">
import { Pepicon } from "@pepicons/vue"

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
      name="open"
      aria-hidden="true"
      role="button"
      title="Open the component in editor"
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
  color: var(--c-text-light-3);
}

.open-in-editor-button:hover {
  color: var(--c-text-light-2);
}
</style>
