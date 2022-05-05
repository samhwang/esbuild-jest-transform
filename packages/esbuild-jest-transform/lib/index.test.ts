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

function getExampleFile(filePath: string) {
  const examplePath = path.resolve(__dirname, '..', '..', '..', 'examples');

  return path.resolve(examplePath, filePath);
}

describe('Transformer tests', () => {
  const nodeFile = getExampleFile('node/index.test.ts');

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
      const output = processSync(nodeFile, { sourcemap: undefined });
      expect(output.map).toEqual('');
      expect(output.code).toContain(
        '//# sourceMappingURL=data:application/json;base64,'
      );
    });

    it('Should correctly get sourcemap as inline if provided', () => {
      const output = processSync(nodeFile, { sourcemap: 'inline' });
      expect(output.map).toEqual('');
      expect(output.code).toContain(
        '//# sourceMappingURL=data:application/json;base64,'
      );
    });

    it('Should get sourcemap as object if true is passed', () => {
      const output = processSync(nodeFile, { sourcemap: true });
      expect(output.map).toHaveProperty('version');
      expect(output.map).toHaveProperty('sources');
      expect(output.map).toHaveProperty('mappings');
      expect(output.map).toHaveProperty('names');
    });

    it('Should match transformed snapshot for node file', () => {
      const output = processSync(nodeFile);
      expect(output.code).toMatchSnapshot();
    });

    it('Should match transformed snapshot for react classic file', () => {
      const reactClassicFuncComp = getExampleFile(
        'react-classic/src/FuncComp.test.tsx'
      );

      const reactClassicClassComp = getExampleFile(
        'react-classic/src/FuncComp.test.tsx'
      );

      const output1 = processSync(reactClassicFuncComp);
      expect(output1.code).toMatchSnapshot();

      const output2 = processSync(reactClassicClassComp);
      expect(output2.code).toMatchSnapshot();
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
      const output = await processAsync(nodeFile, { sourcemap: true });
      expect(output.code).toMatchSnapshot();
    });
  });
});
