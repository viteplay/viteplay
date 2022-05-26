<script setup lang="ts">
import Button from "@my-repo/button/Button.vue"

const foo = await import("./foo.json")
</script>

<template>
  <Button variant="primary">Simple Button</Button>
  {{ JSON.stringify(foo) }}
</template>

<docs darkExample previewClass="p-0">
This is an **example** docs `that` shows above the playground.
</docs>
