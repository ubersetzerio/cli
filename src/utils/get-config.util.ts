import { readFile } from 'node:fs/promises';

import { fileExists } from './file-exists.util.js';

const configFileNames = ['ubersetzer.config.json'];

export type UbersetzerConfig = {
  projects: Record<string, ProjectConfig>;
};

export type ProjectConfig = {
  name?: string;
  path?: string;
  projectId: string;
  secret: string;
};

export async function getConfig(): Promise<UbersetzerConfig> {
  const cwd = process.cwd();

  for (const configFileName of configFileNames) {
    const path = `${cwd}/${configFileName}`;
    const configExists = await fileExists(path);

    if (!configExists) {
      continue;
    }

    const config = JSON.parse(await readFile(path, { encoding: 'utf-8' })) as UbersetzerConfig;

    return config;
  }

  throw undefined;
}
