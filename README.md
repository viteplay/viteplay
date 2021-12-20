# vue-repl

[![npm version](https://badgen.net/npm/v/vue-repl)](https://npm.im/vue-repl) [![npm downloads](https://badgen.net/npm/dm/vue-repl)](https://npm.im/vue-repl)

## Install

```bash
npm i vue-repl
```

## Usage

```vue
<script lang="ts" setup>
import { Repl } from "vue-repl"

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

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
