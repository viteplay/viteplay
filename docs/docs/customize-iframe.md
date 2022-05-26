# Customize the Iframe

The previews for your examples are rendered in iframes so that we can isolate the component styles and avoid conflicts with VitePlay's UI.

VitePlay accepts a `viteplay.iframe.js` or `viteplay.iframe.ts` file in your project root to customize how the example is rendered in the iframe:

```ts
export default {
  // Optional Wrapper component for the example
  Wrapper,
  // Optional function to extend the Vue app instance
  extend({ app }) {
    // app is the Vue app instance
    // you can add Vue plugins normally like this:
    // app.use(SomePlugin)
  },
}
```

In general, if you want to customize the preview, like importing some global CSS, you should do it in `viteplay.iframe.js` instead of in your actual app.
