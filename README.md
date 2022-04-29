# ESBuild Jest Transformer

A Jest transformer using ESBuild.

## Installation

[//]: # (This module can be installed via npm, pnpm or yarn.)

[//]: # ()
[//]: # (```shell)

[//]: # (# If you use npm)

[//]: # (npm install --save-dev esbuild @samhwang/esbuild-jest-transform)

[//]: # ()
[//]: # (# If you use yarn)

[//]: # (yarn add --dev esbuild @samhwang/esbuild-jest-transform)

[//]: # ()
[//]: # (# If you use pnpm)

[//]: # (pnpm add --dev esbuild @samhwang/esbuild-jest-transform)

[//]: # (```)

TBA

## Usage

Add this to your jest config.

```js
module.exports = {
  "transform": {
    "^.+\\.(t|j)sx?$": "@samhwang/esbuild-jest-transform",
  }
};
```

## Options

TBA

## Acknowledgements

- [Jest](https://jestjs.io) the delightful testing framework by [Facebook Open Source team](https://github.com/facebook/jest).
- [ESBuild](https://esbuild.github.io) the extremely fast JS and CSS bundler and minifier by [Evan Wallace](https://github.com/evanw/esbuild).
- [esbuild-jest](https://github.com/aelbore/esbuild-jest) by [aelbore](https://github.com/aelbore).
- [@swc/jest](https://swc.rs/docs/usage/jest) by the [SWC team](https://github.com/swc-project/jest).

