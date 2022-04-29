import * as crypto from 'node:crypto';
import createCacheKey from '@jest/create-cache-key-function';
import { Transformer } from '@jest/transform';
import { transformSync, transform } from 'esbuild';
import { buildEsbuildTransformOpts, TransformerOptions } from './utils';

export type { TransformerOptions };

function createTransformer(
  esbuildTransformOptions?: TransformerOptions
): Transformer<TransformerOptions> {
  return {
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
