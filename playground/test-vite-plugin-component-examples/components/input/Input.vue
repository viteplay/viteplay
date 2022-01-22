<script lang="ts" setup>
const props = defineProps({
  kind: { type: String },
  value: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{ (event: "change", value: string): void }>()
</script>

<template>
  <input
    :style="kind === 'primary' ? 'background: black; color: white' : ''"
    :value="props.value"
    @input="e => emit('change', (e.target as any).value)"
  />
</template>
