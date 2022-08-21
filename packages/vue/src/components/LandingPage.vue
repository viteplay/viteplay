<script setup lang="ts">
import VPHero from "./VP/VPHero.vue"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from "../../../../assets/viteplay-logo-icon.svg"
</script>

<template>
  <VPHero
    name="VitePlay"
    text="Develop Components Without the Hassle"
    tagline="A fully auto-generated and interactive component development environment."
    :image="logo"
    :actions="[
      {
        theme: 'brand',
        text: 'Official Documentation',
        link: 'https://viteplay-docs.onrender.com',
      },
      { theme: 'alt', text: 'View on GitHub', link: 'https://github.com/viteplay/viteplay' },
    ]"
  />
</template>

<style src="./VP/vars.css" />
