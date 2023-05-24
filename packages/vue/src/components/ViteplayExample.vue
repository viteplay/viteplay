<script setup lang="ts">
import { PropDefinition, ComponentExample } from "@viteplay/types"
import ExampleHeader from "./ExampleHeader.vue"
import ViteplayPlayground from "./ViteplayPlayground.vue"

defineProps<{
  example: ComponentExample
  componentProps?: Record<string, PropDefinition[]>
}>()
</script>

<template>
  <section class="viteplay-example">
    <ExampleHeader :slug="example.slug" :title="example.title" :iframeUrl="example.iframeUrl" />

    <div class="viteplay-docs" v-html="example.docs.content"></div>

    <ViteplayPlayground :example="example" :componentProps="componentProps || {}" />
  </section>
</template>
