# vue-playground

[![npm version](https://badgen.net/npm/v/vue-playground)](https://npm.im/vue-playground) [![npm downloads](https://badgen.net/npm/dm/vue-playground)](https://npm.im/vue-playground)

## Install

```bash
npm i vue-playground prismjs
```

## Usage

```vue
<script lang="ts" setup>
import "vue-playground/dist/style.css"
import "prismjs/themes/prism-tomorrow.css"
import { Repl } from "vue-playground"

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
