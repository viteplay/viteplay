# Getting Started

## Requirements

Viteplay is only available for **Vite projects**.

It currently only supports **Vue** based projects, but in the future we plan to support _React_ & _Svelte_ as well. (Maintainers welcome!)

## Vue Setup

Install these dev dependencies:

```sh
npm i -D @viteplay/plugin @viteplay/vue
```

Then you need to add 2 snippets of code to your _vite_ and _vue-router_ config.

### Vite Config

In `vite.config.ts` (or `.js`) add this:

```ts
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import viteplay from "@viteplay/plugin"

export default defineConfig({
  plugins: [
    vue(),
    viteplay({
      // Path to extract components from
      components: "./components/*/*.vue",
      // Path to extract examples from
      componentExamples: "./components/*/examples/*.vue",
      // base route for the development pages
      base: "/dev",
    }),
  ],
})
```

This will auto-detect all your nested components in the `components` folder. (see [config examples](#config-examples) for more examples on different folder structures)

### Vue Router

Add [Vue Router](https://router.vuejs.org) to your project if you haven't already.

In your Vue Router config file, add this:

```ts
import { createRouter, createWebHistory } from "vue-router"
import { pages as pagesVitePlay } from "@viteplay/vue/client"
import "@viteplay/vue/dist/style.css"

console.log(`VitePlay routes for development → `, pagesVitePlay)

export const router = createRouter({
  history: createWebHistory(), // or whatever your project has already
  routes: [
    ...pagesVitePlay,
    // your other routes here...
  ],
})
```

That's all! Now you have a fully auto-generated development environment for your components. Just visit `/dev` on your localhost server and start writing [component examples](/guide/my-first-component)!

#### Detecting your components

Depending on how you want to organise your components folder, you might need a different setup in `viteplay({ ... })` (in `vite.config.ts` or `.js`). Please see [Config Examples](#config-examples) below for an idea for different folder structures.

#### First time setting up Vue Router?

If you hadn't already added vue-router to your Vite project, it's really easy to do so:

1. `npm i vue-router`
2. Save the snippet above as `router.ts` (or `.js`) in your `src` folder.
3. in `src/main.ts` (or `.js`) add `import { router } from './router'` and `createApp(App).use(router)` before `.mount('#app')`
4. in `src/App.vue` make sure it has `<router-view />` in the template.

That's all!

Please check the [Vue Router documentation](https://router.vuejs.org) for more information on Vue Router.

## Config Examples

Here are some examples of common folder structures used in projects, along side the required setup for VitePlay.

### One Folder per Component (recommended)

The great thing about this folder structure in that you can keep on adding component examples without them getting in the way. It's also easy to add automated test files inside each component folder when necessary. Keeping related files together is highly recommended.

```
/src
└─ /components
   ├─ /MyButton
   │  ├─ MyButton.vue (or .jsx / .tsx)
   │  └─ /examples
   │     ├─ Basic.vue
   │     └─ Dark Mode.vue
   └─ /MyInput
      ├─ MyInput.vue
      └─ /examples
         ├─ Basic.vue
         └─ Search.vue
```

```ts
// vite.config.ts (or .js)

// in plugins: [ ... ]
viteplay({
  components: "./components/*/*.vue", // or .jsx / .tsx
  componentExamples: "./components/*/examples/*.vue", // or .jsx / .tsx
})
```

### One Folder per Component — examples with `.` notation

```
/src
└─ /components
   ├─ /MyButton
   │  ├─ MyButton.vue (or .jsx / .tsx)
   │  ├─ Basic.example.vue
   │  └─ Dark Mode.example.vue
   └─ /MyInput
      ├─ MyInput.vue
      ├─ Basic.example.vue
      └─ Search.example.vue
```

```ts
// vite.config.ts (or .js)

// in plugins: [ ... ]
viteplay({
  components: "./components/*/*.vue", // or .jsx / .tsx
  componentExamples: "./components/*/*.example.vue", // or .jsx / .tsx
})
```

### All in Components Folder — examples with `.` notation

```
/src
└─ /components
   ├─ MyButton.vue (or .jsx / .tsx)
   ├─ MyButton.example.Basic.vue
   ├─ MyButton.example.Dark Mode.vue
   ├─ MyInput.vue
   ├─ MyInput.example.Basic.vue
   └─ MyInput.example.Search.vue
```

```ts
// vite.config.ts (or .js)

// in plugins: [ ... ]
viteplay({
  components: "./components/*.vue", // or .jsx / .tsx
  componentExamples: "./components/*.example.*.vue", // or .jsx / .tsx
})
```

### Only Show Specific Components

Instead of auto-detecting components, you can also configure VitePlay to only show specific components/examples on the dev page.

```
/src
└─ /button
   ├─ MyButton.vue (or .jsx / .tsx)
   ├─ Basic.example.vue
   ├─ Dark Mode.example.vue
└─ /input
   ├─ MyInput.vue
   ├─ Basic.example.vue
   └─ Search.example.vue
```

```ts
// vite.config.ts (.js)

// in plugins: [ ... ]
viteplay({
  pages: [
    {
      title: "My Button", // (optional) defaults to the component name
      component: "./button/MyButton.vue", // or .jsx / .tsx
      examples: "./button/*.example.vue", // or .jsx / .tsx
    },
    {
      title: "My Input", // (optional) defaults to the component name
      component: "./input/MyInput.vue", // or .jsx / .tsx
      examples: "./input/*.example.vue", // or .jsx / .tsx
    },
  ],
})
```
