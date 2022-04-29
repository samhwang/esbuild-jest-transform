import * as crypto from 'node:crypto';
import createCacheKey from '@jest/create-cache-key-function';
import { Transformer } from '@jest/transform';
import {
  transformSync,
  transform,
  TransformOptions as ESBuildOptions,
  Loader,
} from 'esbuild';
import { getDefaultTarget, getFileExtensions, getDefaultLoader } from './utils';

export interface TransformerOptions
  extends Pick<
    ESBuildOptions,
    'jsxFragment' | 'jsxFactory' | 'target' | 'format' | 'sourcemap'
  > {
  loaders?: Record<string, Loader>;
}

function buildEsbuildTransformOpts(
  filename: string,
  options?: TransformerOptions
): ESBuildOptions {
  const sourcemap = options?.sourcemap ?? 'inline';
  const target = options?.target ?? getDefaultTarget();

  const extension = getFileExtensions(filename).slice(1);
  const loader: Loader =
    options?.loaders && options.loaders[extension]
      ? options.loaders[extension]
      : getDefaultLoader(extension as Loader);

  return {
    sourcemap,
    target,
    loader,
    sourcefile: filename,
    ...options,
  };
}

function createTransformer(
  esbuildTransformOptions?: TransformerOptions
): Transformer<TransformerOptions> {
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
      });
    },
    getCacheKey(content, filename, options) {
      const esbuildOpts = buildEsbuildTransformOpts(filename);
      const cacheKeyFunction = createCacheKey(
        [],
        [JSON.stringify(esbuildOpts)]
      );

      // @ts-expect-error - type overload is confused, and NewGetCacheKeyFunction is not exported from @jest/types
      const baseCacheKey = cacheKeyFunction(content, filename, options);

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
