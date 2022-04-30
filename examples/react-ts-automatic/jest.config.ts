import { Config } from '@jest/types';
import baseConfig from '../../jest.config.base';

const config: Config.InitialOptions = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': '@samhwang/esbuild-jest-transform',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  cache: false,
};

export default config;
