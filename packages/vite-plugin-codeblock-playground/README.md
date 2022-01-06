# vite-plugin-codeblock-playground

This transforms markdown:

````markdown
Some button:

```vue playground
<button>hi</button>
```
````

Into:

```markdown
Some button:

<Playground :code="decodeURI(encodeURI(`<button>hi</button>`))">
```

Intended to be used with VitePress or anything that transpiles Markdown to Vue SFC.

## License

MIT
