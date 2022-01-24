# @viteplay/vue

[![npm version](https://badgen.net/npm/v/@viteplay/vue)](https://npm.im/@viteplay/vue) [![npm downloads](https://badgen.net/npm/dm/@viteplay/vue)](https://npm.im/@viteplay/vue)

## Install

```bash
npm i @viteplay/vue prismjs
```

## Usage

```vue
<script lang="ts" setup>
import "@viteplay/vue/dist/style.css"
import "prismjs/themes/prism-tomorrow.css"
import { Repl } from "@viteplay/vue"

const code = `
<template>
  <Button @click="inc">
      Click me
  </Button>
</template>
`
</script>

<template>
  <Repl :code="code" />
</template>
```

You can use other Prism themes, but some styling tweaks might be required.

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
