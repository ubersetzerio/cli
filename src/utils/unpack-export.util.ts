import { ProjectConfig } from './get-config.util.js';
import * as yauzl from 'yauzl';
import { TEMP_FILE_PATH } from './download-export.util.js';
import { createWriteStream } from 'fs';
import { mkdir, unlink } from 'fs/promises';
import { fileExists } from './file-exists.util.js';

export async function unpackExport(config: ProjectConfig): Promise<void> {
  config.path = config.path || 'i18n';

  const exists = await fileExists(config.path);

  if (!exists) {
    await mkdir(config.path, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    yauzl.open(
      TEMP_FILE_PATH,
      {
        lazyEntries: true,
      },
      function (error, zipfile) {
        if (error) {
          return reject(error);
        }

        if (!zipfile) {
          return reject();
        }

        zipfile.readEntry();
        zipfile.on('entry', function (entry) {
          if (/\/$/.test(entry.fileName)) {
            zipfile.readEntry();
          } else {
            zipfile.openReadStream(entry, function (error, readStream) {
              if (error) {
                return reject(error);
              }

              if (!readStream) {
                return reject();
              }

              readStream.on('end', function () {
                zipfile.readEntry();
              });

              let fileName = entry.fileName.split('/');
              fileName = fileName[fileName.length - 1];

              readStream.pipe(createWriteStream(`${config.path}/${fileName}`));
            });
          }
        });

        zipfile.once('end', async () => {
          zipfile.close();

          await unlink(TEMP_FILE_PATH);

          return resolve();
        });
      },
    );
  });
}
