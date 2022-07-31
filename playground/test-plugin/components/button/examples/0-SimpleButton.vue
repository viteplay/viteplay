<script setup lang="ts">
import Button from "@my-repo/button/Button.vue"

const foo = await import("./foo.json")
</script>

<template>
  <Button kind="primary">Simple Button</Button>
  {{ JSON.stringify(foo) }}
</template>

<docs>
These are **example** docs `that` show above the playground.
</docs>
