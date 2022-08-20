<script setup lang="ts">
import { PropDefinition, ComponentExample } from "@viteplay/types"
import ExampleHeader from "./ExampleHeader.vue"
import Playground from "./Playground.vue"

defineProps<{
  example: ComponentExample
  componentProps?: Record<string, PropDefinition[]>
}>()
</script>

<template>
  <section class="viteplay-example">
    <ExampleHeader :slug="example.slug" :title="example.title" :iframeUrl="example.iframeUrl" />

    <div class="viteplay-docs" v-html="example.docs.content"></div>

    <Playground :example="example" :componentProps="componentProps || {}" />
  </section>
</template>
