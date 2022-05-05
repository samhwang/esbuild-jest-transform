import { buildEsbuildTransformOpts } from './utils';

const TEST_FILENAME = 'test.ts';

describe('Build ESBuild TransformOptions', () => {
  it('Should return correct config with sourcemap true', () => {
    const output = buildEsbuildTransformOpts(TEST_FILENAME, {
      sourcemap: true,
    });
    expect(output.sourcesContent).toEqual(false);
    expect(output.sourcemap).toEqual(true);
  });

  it('Should return correct config with a sourcemap string', () => {
    const output = buildEsbuildTransformOpts(TEST_FILENAME, {
      sourcemap: 'external',
    });
    expect(output.sourcemap).toEqual('external');
  });

  it('Should return config with source map inline if not provided', () => {
    const output = buildEsbuildTransformOpts(TEST_FILENAME);
    expect(output.sourcemap).toEqual('inline');
  });

  it('Should get the ts loader for ts files if not provided', () => {
    const output = buildEsbuildTransformOpts(TEST_FILENAME);
    expect(output.loader).toEqual('ts');
  });

  it('Should get the provided loader for ts files if provided', () => {
    const output = buildEsbuildTransformOpts('file.test.ts', {
      loaders: { '.test.ts': 'tsx' },
    });
    expect(output.loader).toEqual('tsx');
  });

  it('Should use text for file not in default loaders', () => {
    const output = buildEsbuildTransformOpts('test.random');
    expect(output.loader).toEqual('text');
  });
});
