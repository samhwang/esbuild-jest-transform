import * as crypto from 'node:crypto';
import createCacheKey from '@jest/create-cache-key-function';
import { Transformer } from '@jest/transform';
import { transformSync, transform } from 'esbuild';
import { buildEsbuildTransformOpts, TransformerOptions } from './utils';

export type { TransformerOptions };

function createTransformer(
  transformerOptions?: TransformerOptions
): Transformer {
  return {
    process(content, filename, jestOpts) {
      const esbuildOpts = buildEsbuildTransformOpts(
        filename,
        transformerOptions
      );

      return transformSync(content, {
        ...esbuildOpts,
        format: jestOpts.supportsStaticESM ? 'esm' : 'cjs',
      });
    },
    processAsync(content, filename) {
      const esbuildOpts = buildEsbuildTransformOpts(
        filename,
        transformerOptions
      );

      return transform(content, {
        ...esbuildOpts,
        // Async transform is always going to be esm
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
