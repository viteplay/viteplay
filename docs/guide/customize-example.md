# Customize Example

Let's say you have an example component `SimpleButton.vue`:

```vue
<script setup lang="ts">
import Button from "@my-repo/button/Button.vue"
</script>

<template>
  <Button variant="primary">Simple Button</Button>
</template>

<docs>
This is an **example** docs `that` shows above the playground.
</docs>
```

It gets rendered into:

![example](https://cdn.jsdelivr.net/gh/egoist-bot/images@main/uPic/viteplay-example.jpg)

## `<docs>` block

You can use the `<docs>` block in a `.vue` file to write markdown docs for your example.

It also accepts some special attributes:

- `previewClass`: Adding class names to the preview `div`.
  Eg. you could change the background with `previewClass="bg-navy"`. `bg-navy` is a custom class name that is NOT bundled with VitePlay, you'll need to write your own CSS and import it in the [iframe wrapper](/guide/customize-iframe).
- `darkPreview`: If you want to use a dark preview, you can add this attribute, it's the same as `previewClass="dark"`

## Dark Example Preview

This example will render with a default black background:

```vue
<script setup lang="ts">
import Button from "@my-repo/button/Button.vue"
</script>

<template>
  <Button variant="primary">Simple Button</Button>
</template>

<docs darkPreview />
```
