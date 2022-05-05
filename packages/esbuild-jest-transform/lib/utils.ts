import * as process from 'node:process';
import * as path from 'node:path';
import { Loader, TransformOptions as ESBuildOptions } from 'esbuild';
import { DEFAULT_LOADERS, DEFAULT_NODE_TARGETS } from './defaults';

export interface Options extends Omit<ESBuildOptions, 'loader'> {
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

function getLoaderFromFilename(
  filename: string,
  loaders?: Options['loaders']
): Loader {
  const extension = getFileExtensions(filename).slice(1);
  return loaders && loaders[extension]
    ? loaders[extension]
    : getDefaultLoader(extension as Loader);
}

function getSourcemapOptions(
  sourcemap?: Options['sourcemap']
): Partial<Options> {
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
  options: Options = {}
): ESBuildOptions {
  const {
    sourcemap,
    target = getDefaultTarget(),
    loaders,
    ...esbuildOptions
  } = options;
  const sourcemapOpts = getSourcemapOptions(sourcemap);
  const loader = getLoaderFromFilename(filename, loaders);

  return {
    ...esbuildOptions,
    target,
    loader,
    sourcefile: filename,
    ...sourcemapOpts,
  };
}
