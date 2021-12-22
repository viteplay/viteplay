<script setup lang="ts">
defineProps({
  bg: {
    type: String,
    default: "black",
  },
  color: {
    type: String,
    default: "red",
  },
})
</script>

<template>
  <button class="button"><slot /></button>
</template>

<style scoped>
.button {
  background-color: v-bind(bg);
  color: v-bind(color);
}
</style>
