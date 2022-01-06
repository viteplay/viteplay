<script lang="ts" setup>
const props = defineProps({
  value: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{ (event: "change", value: string): void }>()
</script>

<template>
  <input
    :value="props.value"
    @input="e => emit('change', (e.target as any).value)"
  />
</template>
