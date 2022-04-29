import * as process from 'node:process';
import * as path from 'node:path';
import { Loader } from 'esbuild';

export const DEFAULT_LOADERS: Loader[] = ['js', 'jsx', 'ts', 'tsx', 'json'];

const DEFAULT_NODE_TARGETS = new Map([
  ['12', 'es2018'],
  ['13', 'es2019'],
  ['14', 'es2020'],
  ['15', 'es2021'],
  ['16', 'es2021'],
  ['17', 'es2022'],
]);

export function getDefaultTarget(): string {
  return (
    DEFAULT_NODE_TARGETS.get(process.version.match(/v(\d+)/)![1]) || 'es2018'
  );
}

export function getFileExtensions(fileName: string): string {
  const baseName = path.basename(fileName);
  return path.extname(baseName).replace(/(\.[a-z0-9]+).*/i, '$1');
}

export function getDefaultLoader(extension: Loader): Loader {
  if (DEFAULT_LOADERS.includes(extension)) return extension;

  return 'text';
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
