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
npm i -g ultra-runner

# the `+` prefix asks ultra to build the package's dependencies first
ultra -r --filter +<package-name> dev

# e.g.
ultra -r --filter +test-vue-repl dev
```

## License

MIT
