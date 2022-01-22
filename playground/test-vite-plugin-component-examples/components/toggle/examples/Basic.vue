<script lang="ts" setup>
import { ref } from "vue"
import Toggle from "../Toggle.vue"

const t = ref(true)
</script>

<template>
  <Toggle v-model="t" />
  <pre>{{ t }}</pre>
</template>
