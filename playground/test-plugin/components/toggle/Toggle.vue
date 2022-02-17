<script lang="ts" setup>
import { computed } from "vue"
import Button from "@my-repo/button/Button.vue"

const props = defineProps<{
  modelValue: boolean
}>()

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

  <Button>test button</Button>
</template>
