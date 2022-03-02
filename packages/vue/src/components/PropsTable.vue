<script lang="ts" setup>
import { PropDefinition } from "@viteplay/types"
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const hasFocus = computed(() => route.query.focus)

const props = defineProps<{
  componentName: string
  componentProps: Record<string, PropDefinition[]>
}>()

const arr = computed(() => props.componentProps[props.componentName])
</script>

<template>
  <div v-if="!hasFocus && arr && arr.length > 0" class="props-table">
    <h2>Props</h2>
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
