<script setup lang="ts">
const props = defineProps<{
  /** Choose a button kind */
  kind?: "primary" | "error" | "warning" | "info"
}>()
</script>

<template>
  <button :class="`_kind-${props.kind}`">
    <slot></slot>
  </button>
</template>

<style scoped>
._kind-primary {
  background-color: mediumslateblue;
  color: white;
}

._kind-error {
  background-color: tomato;
}

._kind-warning {
  background-color: goldenrod;
}

._kind-info {
  background-color: lightskyblue;
}
</style>
