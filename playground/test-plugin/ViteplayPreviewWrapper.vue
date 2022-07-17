<script setup></script>

<template>
  <slot />
</template>

<style lang="scss">
// import global CSS styles so they are applied to the VitePlay preview iframe
@import "./css/app.css";

// you could center all example previews
// html,
// body {
//   height: 100%;
// }
// body {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: 0;
// }
</style>
