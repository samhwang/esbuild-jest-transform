import babelJest from 'babel-jest';
import { defaults } from 'jest-config';
import { TransformOptions } from '@jest/transform';
import { TransformOptions as BabelOptions } from '@babel/core';

const babel = babelJest.createTransformer!({
  parserOpts: {
    plugins: ['jsx', 'typescript'],
  },
});

export function babelTransform(
  sourceText: string,
  sourcePath: string,
  babelOptions?: BabelOptions
) {
  const config: TransformOptions<BabelOptions> = {
    config: {
      ...defaults,
    },
    transformerConfig: {
      ...babelOptions,
    },
  } as any;
  return babel.process(sourceText, sourcePath, config);
}

export function babelTransformAsync(
  sourceText: string,
  sourcePath: string,
  babelOptions?: BabelOptions
) {
  const config: TransformOptions<BabelOptions> = {
    config: {
      ...defaults,
    },
    transformerConfig: {
      ...babelOptions,
    },
  } as any;
  return babel.processAsync!(sourceText, sourcePath, config);
}
