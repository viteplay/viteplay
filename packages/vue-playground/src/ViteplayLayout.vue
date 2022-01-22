<script lang="ts" setup>
defineProps<{
  pages: { title: string; path: string }[]
  pathParent: string
}>()
</script>

<template>
  <nav>
    <ul>
      <li v-for="p in pages">
        <router-link :to="`${pathParent}/${p.path}`">{{ p.title }}</router-link>
      </li>
    </ul>
  </nav>
  <router-view></router-view>
</template>

<style></style>
