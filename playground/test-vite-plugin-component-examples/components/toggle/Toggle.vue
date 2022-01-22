<script lang="ts" setup>
import { computed } from "vue"

const props = defineProps({
  modelValue: { type: Boolean },
})

const emit = defineEmits<{ (e: "update:modelValue", newVal: boolean): void }>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(newVal: boolean) {
    emit("update:modelValue", newVal)
  },
})
</script>

<template>
  <input type="checkbox" v-model="model" />
</template>
