const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  transform: {
    '^.+\\.(t|j)sx?$': '@samhwang/esbuild-jest-transformer',
  },
  cache: false,
};
