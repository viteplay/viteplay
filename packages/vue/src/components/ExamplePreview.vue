<script lang="ts" setup>
const props = defineProps({
  code: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>{{ props.code }}</div>
</template>
