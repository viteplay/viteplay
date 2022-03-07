<script lang="ts" setup>
import { PropDefinition } from "@viteplay/types"
import { computed } from "vue"
import { useRoute } from "vue-router"
import ExampleHeader from "./ExampleHeader.vue"

const route = useRoute()
const hasFocusedExample = computed(() => route.query.focus && route.hash !== "#props")

const props = defineProps<{
  componentName: string
  componentProps: Record<string, PropDefinition[]>
}>()

const arr = computed(() => props.componentProps[props.componentName])
</script>

<template>
  <div v-if="!hasFocusedExample && arr && arr.length > 0" class="props-table viteplay-docs">
    <ExampleHeader title="Props" slug="props" />
    <table>
      <thead>
        <tr>
          <td>Name</td>
          <td>Type</td>
          <td>Required</td>
          <td>Description</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in arr" :key="prop.name">
          <td>{{ prop.name }}</td>
          <td>{{ prop.type }}</td>
          <td>{{ prop.required ? "required" : "optional" }}</td>
          <td>{{ prop.desc }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.props-table thead {
  font-weight: bold;
}
</style>
