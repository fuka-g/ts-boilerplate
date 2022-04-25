# ts-boilerplate

Boilerplate project including a custom-made preprocessor (`fuka-g/build-tool`), packager (`vercel/pkg`) and linter (`eslint/eslint`).



## Scripts

### build

Build and package using default flags.

### build-dev

Build and package using only the `dev` flag.

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