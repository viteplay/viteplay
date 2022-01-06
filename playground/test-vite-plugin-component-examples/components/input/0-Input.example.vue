<script lang="ts" setup>
import { ref } from "vue"
import Input from "./Input.vue"

const value = ref("")
</script>

<template>
  <Input :value="value" @change="(v) => (value = v)" />
  <pre>{{ value }}</pre>
</template>
