<script lang="ts" setup>
import { ref } from "vue"
import MyInput from "./MyInput.vue"

const value = ref("")
</script>

<template>
  <MyInput type="search" :value="value" @change="(v) => (value = v)" />
  <pre>{{ value }}</pre>
</template>
