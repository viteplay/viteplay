<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String,
  },
})
</script>

<template>
  <button :class="[`is-${props.variant}`]"><slot></slot></button>
</template>

<style scoped>
.is-primary {
  background-color: blue;
  color: white;
}

.is-error {
  background-color: red;
}

.is-warning {
  background-color: orange;
}

.is-info {
  background-color: cyan;
}
</style>
