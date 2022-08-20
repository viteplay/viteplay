<script lang="ts" setup>
const props = defineProps<{
  type?: "search" | "text"
  value: string
  complex?: {
    foo: string
    bar?: number
  }
}>()

const emit = defineEmits<{ (event: "change", value: string): void }>()
</script>

<template>
  <input
    :type="type"
    :class="`my-input ${type === 'search' ? '_search' : ''}`"
    :value="props.value"
    @input="e => emit('change', (e.target as any).value)"
  />
</template>

<style scoped>
.my-input {
  padding: 0.5rem 1rem;
}

._search {
  background: whitesmoke;
  color: black;
  border-radius: 0.5rem;
  border-width: thin;
}
</style>
