import { Config } from '@jest/types';
import baseConfig from '../../jest.config.base';

const config: Config.InitialOptions = {
  ...baseConfig,
  testPathIgnorePatterns: ['<rootDir>/build'],
  transform: {
    '^.+\\.(t|j)sx?$': '<rootDir>/build',
  },
};

export default config;
