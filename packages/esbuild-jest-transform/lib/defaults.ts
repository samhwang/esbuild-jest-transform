import { Loader } from 'esbuild';

export const DEFAULT_LOADERS: Loader[] = ['js', 'jsx', 'ts', 'tsx', 'json'];

export const DEFAULT_NODE_TARGETS = new Map([
  ['12', 'es2018'],
  ['13', 'es2019'],
  ['14', 'es2020'],
  ['15', 'es2021'],
  ['16', 'es2021'],
  ['17', 'es2022'],
]);
