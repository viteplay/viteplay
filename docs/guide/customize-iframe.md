# Customize the Iframe

The previews for your examples are rendered in iframes so that we can isolate the component styles and avoid conflicts with VitePlay's UI.

VitePlay accepts a `viteplay.iframe.js` or `viteplay.iframe.ts` file in your project root to customize how the example is rendered in the iframe:

```ts
import VitePlayWrapper from "./VitePlayWrapper.vue"

export default {
  // Optional Wrapper component for the example
  Wrapper: VitePlayWrapper,
  // Optional function to extend the Vue app instance
  extend({ app }) {
    // app is the Vue app instance
    // you can add Vue plugins normally like this:
    // app.use(SomePlugin)
  },
}
```

In general, if you want to customize the rendered preview, like applying some global CSS, you can do this either in `viteplay.iframe.js` or in the Wrapper component you import in here.

Here is an example of what your `VitePlayWrapper.vue` could look like:

```vue
<script setup></script>

<template>
  <slot />
</template>

<style lang="scss">
// import global CSS styles so they are applied to the VitePlay preview iframe
@import "./global.css";

// you can target `html`, `body` and `#app` to add extra styling as well.
</style>
```

:::info
If you use TS, you will have to add `"./viteplay.iframe.ts"` to the `"include": [...]` array in your `tsconfig.json`.
:::

## Centering all example previews

Here is an example of what your `VitePlayWrapper.vue` could look like if you want all example previews to be centered:

```vue
<script setup></script>

<template>
  <slot />
</template>

<style lang="scss">
// all VitePlay example previews centered.
html,
body {
  height: 100%;
}
body {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
</style>
```
