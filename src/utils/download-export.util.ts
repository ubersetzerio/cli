import axios, { AxiosError } from 'axios';
import { createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';

import {ProjectConfig} from './get-config.util.js';
import {URL} from './url.util.js';

export const TEMP_FILE_PATH = 'ubersetzer.tmp.zip';

export async function downloadExport(config: ProjectConfig): Promise<void> {
  const writer = createWriteStream(TEMP_FILE_PATH);

  try {
    const response = await axios.get(URL.projectsExportKeys(config.projectId), {
      headers: {
        'X-Api-Token': config.secret,
      },
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);

      writer.on('close', async () => resolve());

      writer.on('errror', async error => reject(error));
    });
  } catch (error) {
    await unlink(TEMP_FILE_PATH);

    return Promise.reject((error as AxiosError).response?.status);
  }
}
