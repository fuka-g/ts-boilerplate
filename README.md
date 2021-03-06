# ts-boilerplate

Boilerplate project including a custom-made preprocessor (`fuka-g/build-tool`), packager (`vercel/pkg`) and linter (`eslint/eslint`).

**Projects are currently limited to CJS due to `pkg`'s limitations ([Issue](https://github.com/vercel/pkg/issues/1291) | [PR](https://github.com/vercel/pkg/pull/1323))**

## TODO

 - Find a way to exclude package.json (pkg's fault)
 - Find a way to allow esm imports/exports (pkg's fault)

## NPM Scripts

### build

Build and package using default flags.

### build-release

Build and package only using the `build` flag.

### build-tool

Calls the build tool. See `fuka-g/build-tool` for more info.

### package

Under-the-hood script. Calls pkg and then the `postbuild` script.

### lint

Calls ESLint

### start

Runs `build-tool` and runs the built script.

### start-release

Runs `build-tool` with only the flag `build` and runs the built script.

### test

Calls the test suite.

### tsc

Summons the TypeScript daemon.

## Scripts

### build-tool

See `fuka-g/build-tool`

### postbuild

Renames the built packages to include the version (maybe more in the future).

### prerun

Used to carry assets from the dev environment to the production environment.
