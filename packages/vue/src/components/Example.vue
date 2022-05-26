<script setup lang="ts">
import { PropType } from "vue"
import { PropDefinition, ComponentExample } from "@viteplay/types"
import ExampleHeader from "./ExampleHeader.vue"
import Playground from "./Playground.vue"

defineProps({
  example: {
    type: Object as PropType<ComponentExample>,
  },
  componentProps: {
    type: Object as PropType<Record<string, PropDefinition[]>>,
    default: () => ({}),
  },
})
</script>

<template>
  <section class="viteplay-example">
    <ExampleHeader :slug="example.slug" :title="example.title" :iframeUrl="example.iframeUrl" />

    <div class="viteplay-docs" v-html="example.docs.content"></div>

    <Playground :example="example" :componentProps="componentProps" />
  </section>
</template>
