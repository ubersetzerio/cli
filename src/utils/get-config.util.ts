import { readFile } from "fs/promises";
import { fileExists } from "./file-exists.util";

const configFilesNames = ["ubersetzer.config.json"];

export type UbersetzerConfig = {
  projects: Record<string, ProjectConfig>;
};

export type ProjectConfig = {
  projectId: string;
  secret: string;
  name?: string;
  path?: string;
};

export async function getConfig(): Promise<UbersetzerConfig> {
  const cwd = process.cwd();

  for (const configFileName of configFilesNames) {
    const path = `${cwd}/${configFileName}`;
    const configExists = await fileExists(path);

    if (!configExists) {
      continue;
    }

    const config = JSON.parse(
      await readFile(path, { encoding: "utf-8" })
    ) as UbersetzerConfig;

    return config;
  }

  return Promise.reject();
}
