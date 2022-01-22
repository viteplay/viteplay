<script lang="ts" setup>
import { ref } from "vue"
import Input from "../Input.vue"

const value = ref("")
</script>

<template>
  advanced example
  <Input kind="primary" :value="value" @change="(v) => (value = v)" />
  <pre>{{ value }}</pre>
</template>
