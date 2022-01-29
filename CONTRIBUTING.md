## Release

As we're at alpha stage, we release a new patch version `0.0.x` for every release.

For now, all the packages will be published as the same version, going forward, we may need to version them separately.

To cut a release, make sure you have signed in to npm locally, and then run: `pnpm release` in the root project and select `patch`. It does following things:

- Update `version` in `packages/*/package.json`
- Create git tag
- Publish all packages
- Push to GitHub
