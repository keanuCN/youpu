import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

function candidateRoots(startDir: string): string[] {
  return [
    resolve(startDir),
    resolve(startDir, '..'),
    resolve(startDir, '..', '..'),
    resolve(startDir, '..', '..', '..'),
    resolve(__dirname, '..', '..', '..', '..'),
  ];
}

export function findRepositoryRoot(startDir = process.cwd()): string {
  const root = candidateRoots(startDir).find(
    (candidate) => existsSync(resolve(candidate, 'package.json')) && existsSync(resolve(candidate, 'data', 'categories.yaml')),
  );
  if (!root) {
    throw new Error('无法定位仓库根目录：未找到 package.json 和 data/categories.yaml');
  }
  return root;
}

export function resolveDataDir(dataDir?: string, repositoryRoot = findRepositoryRoot()): string {
  return dataDir ? resolve(repositoryRoot, dataDir) : resolve(repositoryRoot, 'data');
}

export function resolveOutputDir(outDir: string, repositoryRoot = findRepositoryRoot()): string {
  return resolve(repositoryRoot, outDir);
}
