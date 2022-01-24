## Development Setup

You will need pnpm.

After cloning the repo, run:

```
pnpm i
```

To build all packages, run:

```
pnpm run build -r
```

To run a playground in the `playground` director:

```bash
# Run dev script for all packages first:
pnpm dev

# Then run specific playground like:
pnpm dev --filter test-vue
```

## License

MIT
