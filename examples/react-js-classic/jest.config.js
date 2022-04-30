const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': '@samhwang/esbuild-jest-transform',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  cache: false,
};
