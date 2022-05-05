import * as fs from 'node:fs';
import * as path from 'node:path';
import { TransformOptions } from '@jest/transform';
import { defaults } from 'jest-config';
import transformer, { Options } from './index';

function getTransformConfig(sourcePath: string, options?: Options) {
  const Transformer = transformer.createTransformer({
    format: 'cjs',
    sourcemap: true,
    ...options,
  });

  const config: TransformOptions = {
    config: {
      ...defaults,
      cwd: path.resolve(),
    },
  } as any;

  return { Transformer, config };
}

describe('Transformer tests', () => {
  const tsfile = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'examples',
    'node',
    'index.test.ts'
  );

  describe('Process Sync', () => {
    function processSync(sourcePath: string, options?: Options) {
      const content = fs.readFileSync(sourcePath, 'utf-8');

      const { Transformer, config } = getTransformConfig(sourcePath, options);

      return Transformer.process!(content, sourcePath, config) as {
        code: string;
        map: string;
      };
    }

    it('Should have sourcemap inline as default', () => {
      const output = processSync(tsfile, { sourcemap: undefined });
      expect(output.map).toEqual('');
      expect(output.code).toContain(
        '//# sourceMappingURL=data:application/json;base64,'
      );
    });

    it('Should correctly get sourcemap as inline if provided', () => {
      const output = processSync(tsfile, { sourcemap: 'inline' });
      expect(output.map).toEqual('');
      expect(output.code).toContain(
        '//# sourceMappingURL=data:application/json;base64,'
      );
    });

    it('Should get sourcemap as object if true is passed', () => {
      const output = processSync(tsfile, { sourcemap: true });
      const mapObject = JSON.parse(output.map);
      expect(mapObject).toHaveProperty('version');
      expect(mapObject).toHaveProperty('sources');
      expect(mapObject).toHaveProperty('mappings');
      expect(mapObject).toHaveProperty('names');
    });

    it('Should match transformed snapshot', () => {
      const output = processSync(tsfile, { sourcemap: true });
      expect(output.map).toMatchSnapshot();
      expect(output.code).toMatchSnapshot();
    });
  });

  describe('Process async', () => {
    function processAsync(sourcePath: string, options?: Options) {
      const content = fs.readFileSync(sourcePath, 'utf-8');

      const { Transformer, config } = getTransformConfig(sourcePath, options);

      return Transformer.processAsync!(content, sourcePath, config) as Promise<{
        code: string;
        map: string;
      }>;
    }

    it('Should match transformed snapshot', async () => {
      const output = await processAsync(tsfile, { sourcemap: true });
      expect(output.map).toMatchSnapshot();
      expect(output.code).toMatchSnapshot();
    });
  });
});
