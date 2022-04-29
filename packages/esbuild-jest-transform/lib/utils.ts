import * as process from 'node:process';
import * as path from 'node:path';
import { Loader, TransformOptions as ESBuildOptions } from 'esbuild';
import { DEFAULT_LOADERS, DEFAULT_NODE_TARGETS } from './defaults';

export interface TransformerOptions extends Omit<ESBuildOptions, 'loader'> {
  loaders?: Record<string, Loader>;
  sourcemap?: Exclude<ESBuildOptions['sourcemap'], 'linked'>;
}

function getDefaultTarget(): string {
  const currentNodeVersion = process.version.match(/v(\d+)/)![1];
  return DEFAULT_NODE_TARGETS.get(currentNodeVersion) || 'es2018';
}

function getFileExtensions(fileName: string): string {
  const baseName = path.basename(fileName);
  return path.extname(baseName).replace(/(\.[a-z0-9]+).*/i, '$1');
}

function getDefaultLoader(extension: Loader): Loader {
  return DEFAULT_LOADERS.includes(extension) ? extension : 'text';
}

export function set(obj: any, filePath: string, value: any) {
  let o = obj;
  const parents = filePath.split('.');
  const key = parents.pop() as string;

  parents.forEach((prop) => {
    if (o[prop] == null) o[prop] = {};
    o = o[prop];
  });

  o[key] = value;
}

function getSourcemapOptions(
  sourcemap?: TransformerOptions['sourcemap']
): Partial<TransformerOptions> {
  if (!sourcemap) {
    return { sourcemap: 'inline' };
  }

  if (typeof sourcemap === 'string') {
    return { sourcemap };
  }

  return {
    sourcemap: true,
    sourcesContent: false,
  };
}

export function buildEsbuildTransformOpts(
  filename: string,
  options?: TransformerOptions
): ESBuildOptions {
  const sourcemapOpts = getSourcemapOptions(options?.sourcemap);
  const target = options?.target ?? getDefaultTarget();

  const extension = getFileExtensions(filename).slice(1);
  const loader: Loader =
    options?.loaders && options.loaders[extension]
      ? options.loaders[extension]
      : getDefaultLoader(extension as Loader);

  return {
    ...options,
    target,
    loader,
    sourcefile: filename,
    ...sourcemapOpts,
  };
}
