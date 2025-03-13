import { createWriteStream } from "node:fs";
import { mkdir, unlink } from "node:fs/promises";
import * as yauzl from "yauzl";

import { TEMP_FILE_PATH } from "./download-export.util.js";
import { fileExists } from "./file-exists.util.js";
import { ProjectConfig } from "./get-config.util.js";

export async function unpackExport(config: ProjectConfig): Promise<void> {
  config.path = config.path || "i18n";

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
      (error, zipfile) => {
        if (error) {
          return reject(error);
        }

        if (!zipfile) {
          return reject();
        }

        zipfile.readEntry();
        zipfile.on("entry", (entry) => {
          if (/\/$/.test(entry.fileName)) {
            zipfile.readEntry();
          } else {
            zipfile.openReadStream(entry, (error, readStream) => {
              if (error) {
                return reject(error);
              }

              if (!readStream) {
                return reject();
              }

              readStream.on("end", () => {
                zipfile.readEntry();
              });

              let fileName = entry.fileName.split("/");
              fileName = fileName.at(-1);

              readStream.pipe(createWriteStream(`${config.path}/${fileName}`));
            });
          }
        });

        zipfile.once("end", async () => {
          zipfile.close();

          await unlink(TEMP_FILE_PATH);

          return resolve();
        });
      }
    );
  });
}
