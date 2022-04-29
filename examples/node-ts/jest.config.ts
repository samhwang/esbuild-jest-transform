import { Config } from '@jest/types';
import baseConfig from '../../jest.config.base';

const config: Config.InitialOptions = {
  ...baseConfig,
  transform: {
    '^.+\\.(t|j)sx?$': '@samhwang/esbuild-jest-transformer',
  },
  cache: false,
};

export default config;
