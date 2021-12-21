## Development Setup

You will need pnpm.

After cloning the repo, run:

```
pnpm i
```

To build all packages, run:

```
pnpm run build
```

To run a playground in the `playground` directory, run:

```bash
turbo run dev --scope=<package-name>

# e.g.
turbo run dev --scope=test-vue-repl
```

## License

MIT
