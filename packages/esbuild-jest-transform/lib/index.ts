import * as crypto from 'node:crypto';
import createCacheKey from '@jest/create-cache-key-function';
import { Transformer } from '@jest/transform';
import { transformSync, transform } from 'esbuild';
import { buildEsbuildTransformOpts, Options } from './utils';
import { babelTransform, babelTransformAsync } from './babel';

export type { Options };

function createTransformer(transformerOptions?: Options): Transformer {
  return {
    process(content, filename, jestOpts) {
      const esbuildOpts = buildEsbuildTransformOpts(
        filename,
        transformerOptions
      );

      const { code, map } = transformSync(content, {
        ...esbuildOpts,
        format: jestOpts.supportsStaticESM ? 'esm' : 'cjs',
      });
      const mapObj = map.length >= 2 ? JSON.parse(map) : map;

      return babelTransform(code, filename, {
        inputSourceMap: mapObj,
        sourceMaps: transformerOptions?.sourcemap,
      });
    },
    async processAsync(content, filename) {
      const esbuildOpts = buildEsbuildTransformOpts(
        filename,
        transformerOptions
      );

      const { code, map } = await transform(content, {
        ...esbuildOpts,
        // Async transform is always going to be esm
        format: 'esm',
      });
      const mapObj = map.length >= 2 ? JSON.parse(map) : map;

      return babelTransformAsync(code, filename, {
        inputSourceMap: mapObj,
        sourceMaps: transformerOptions?.sourcemap,
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
