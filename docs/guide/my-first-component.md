# My First Component

## Example Project

There is a Vue example project available in the [Github Repo here](https://github.com/viteplay/viteplay/tree/main/playground/example-project-vue).

You can

## Button Example

### Open VitePlay in the browser

1. First, make sure you followed the [setup](/guide/getting-started).
2. Launch your project's dev server.
3. Visit http://localhost:3000/dev in your browser. The `/dev` route can be [changed via the config](/guide/getting-started#vite-config).

### Decide on the File Structure

We will use the [recommended folder structure](/guide/getting-started#one-folder-per-component-recommended) for this example. For our first component example:

```
/src
└─ /components
   └─ /MyButton
      ├─ MyButton.vue
      └─ /examples
         └─ Basic.vue
```

For our first VitePlay component, let's add the component (`MyButton.vue`) and example (`Basic.vue`) files:

### Add the Button File

`/src/components/MyButton/MyButton.vue`

For `MyButton.vue` let's add a really simple button:

```vue
<script setup lang="ts">
const props = defineProps<{
  /** Choose a button kind */
  kind?: "primary" | "secondary"
}>()
</script>

<template>
  <button :class="`_kind-${props.kind}`"><slot /></button>
</template>

<style scoped>
._kind-primary {
  background-color: mediumslateblue;
  color: white;
}
._kind-secondary {
  background-color: lightskyblue;
}
</style>
```

### Add the Example File

`/src/components/MyButton/examples/Basic.vue`

Most examples can (and should) be as short as possible. This is the only thing we need for our Basic example:

```vue
<script setup lang="ts">
import MyButton from "../MyButton.vue"
</script>

<template>
  <MyButton>Basic Button</MyButton>
</template>
```

### Check your VitePlay dev page

Todo: add screenshot of the VitePlay dev page that is rendered so far

## The VitePlay Philosophy

One of [VitePlay's Design Goals](/about/design-goals-motivation-and-team#design-goals) is that you keep your examples **as short and focussed as possible**. The reason for this is that we want to only show the code of an example that's actually relevant to rendering a component for that specific use case / with those specific props.

If you try to fit in many usage examples into one VitePlay example file, it will become more difficult to filter out the parts unrelated to the specific use case you are interested in when referencing it later.

That's why our suggestion is to make many small example files. One for each prop or even one for each possible value of a prop.

Let's add 2 more VitePlay example files of our button:

`/src/components/MyButton/examples/Primary.vue`

```vue
<script setup lang="ts">
import MyButton from "../MyButton.vue"
</script>

<template>
  <MyButton kind="primary">Primary Button</MyButton>
</template>
```

`/src/components/MyButton/examples/Secondary.vue`

```vue
<script setup lang="ts">
import MyButton from "../MyButton.vue"
</script>

<template>
  <MyButton kind="secondary">Secondary Button</MyButton>
</template>
```

### Check your VitePlay dev page

Todo: add screenshot of the VitePlay dev page that is rendered so far

## Input Example

When you create components that can be used with `v-model`, like an input field, this is a great opportunity to show the current "value" in your VitePlay example:

```vue
<script setup lang="ts">
import { ref } from "vue"
import MyInput from "../MyInput.vue"

const value = ref("")
</script>

<template>
  <MyInput v-model="value" />

  <pre>{{ value }}</pre>
</template>
```

This way you can easily double check if your input's v-model is properly set up for success!

### Check your VitePlay dev page

Todo: add screenshot of the VitePlay dev page that is rendered so far
