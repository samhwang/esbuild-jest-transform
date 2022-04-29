import * as crypto from 'node:crypto';
import createCacheKey from '@jest/create-cache-key-function';
import { Transformer, TransformOptions as JestOptions } from '@jest/transform';
import {
  transformSync,
  transform,
  TransformOptions as ESBuildOptions,
  Loader,
} from 'esbuild';
import { getDefaultTarget, getFileExtensions, getDefaultLoader } from './utils';

function buildEsbuildTransformOpts(
  filename: string,
  esbuildOptions?: ESBuildOptions
): ESBuildOptions {
  const sourcemap = esbuildOptions?.sourcemap ?? 'inline';
  const target = esbuildOptions?.target ?? getDefaultTarget();

  const extension = getFileExtensions(filename).slice(1);
  const loader =
    esbuildOptions?.loader ?? getDefaultLoader(extension as Loader);

  return {
    sourcemap,
    target,
    loader,
    ...esbuildOptions,
  };
}

function createTransformer(
  esbuildTransformOptions: ESBuildOptions
): Transformer<ESBuildOptions> {
  return {
    canInstrument: true,
    process(content, filename, jestOpts) {
      const esbuildOpts = buildEsbuildTransformOpts(
        filename,
        esbuildTransformOptions
      );

      return transformSync(content, {
        ...esbuildOpts,
        format: jestOpts.supportsStaticESM ? 'esm' : 'cjs',
        sourcefile: filename,
      });
    },
    processAsync(content, filename) {
      const esbuildOpts = buildEsbuildTransformOpts(
        filename,
        esbuildTransformOptions
      );

      return transform(content, {
        ...esbuildOpts,
        format: 'esm',
        sourcefile: filename,
      });
    },
    getCacheKey(content, filename, ...opts) {
      const esbuildOpts = buildEsbuildTransformOpts(filename);
      const cacheKeyFunction = createCacheKey(
        [],
        [JSON.stringify(esbuildOpts)]
      );

      // @ts-expect-error - type overload is confused, and NewGetCacheKeyFunction is not exported from @jest/types
      const baseCacheKey = cacheKeyFunction(content, filename, ...opts);

      const options: JestOptions | undefined =
        // @ts-expect-error - signature mismatch between Jest <27 og >=27
        typeof opts[0] === 'string' ? opts[1] : opts[0];

      return crypto
        .createHash('md5')
        .update(baseCacheKey)
        .update('\0', 'utf-8')
        .update(
          JSON.stringify({ supportsStaticESM: options?.supportsStaticESM })
        )
        .digest('hex');
    },
  };
}

export default { createTransformer };
