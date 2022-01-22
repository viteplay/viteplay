<script lang="ts" setup>
defineProps<{
  pages: {
    title: string
    path: string
    children: { title: string; hashtag: string }[]
  }[]
  pathParent: string
}>()
</script>

<template>
  <nav>
    <ul>
      <li v-for="p in pages">
        <router-link :to="`${pathParent}/${p.path}`">{{ p.title }}</router-link>
        <ul>
          <li v-for="c in p.children">
            <router-link :to="`${pathParent}/${p.path}#${c.hashtag}`">{{
              c.title
            }}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
  <router-view></router-view>
</template>

<style></style>
