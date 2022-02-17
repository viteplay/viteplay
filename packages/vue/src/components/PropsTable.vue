<script lang="ts" setup>
import { PropDefinition } from "@viteplay/types"

const props = defineProps<{
  props: PropDefinition[]
}>()
</script>

<template>
  <div v-if="props.props.length > 0" class="props-table">
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
        <tr v-for="prop in props.props" :key="prop.name">
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
