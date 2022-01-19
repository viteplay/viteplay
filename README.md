## Development Setup

You will need pnpm.

After cloning the repo, run:

```
pnpm i
```

To build all packages, run:

```
npm i -g ultra-runner
ultra -r build
```

To run a playground in the `playground` directory, run:

```bash
# the `+` prefix asks ultra to build the package's dependencies first
ultra -r --filter +<package-name> dev

# e.g.
ultra -r --filter +test-vue-playground dev
```

## License

MIT
