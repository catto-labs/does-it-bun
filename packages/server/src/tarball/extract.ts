import type { Readable } from "node:stream";
import type { FileFromTarball } from "./types";
import tar from "tar";

const extractTarball = (tarball: Readable) => new Promise((resolve, reject) => {
  try {
    const files: Record<string, FileFromTarball> = {};
  
    tarball.pipe(
      new tar.Parse()
        .on('entry', entry => {
          const file: FileFromTarball = {
            path: entry.path,
            content: ""
          };

          files[entry.path] = file;

          entry.on("data", (tarFileData) => {
            file.content += tarFileData.toString("utf-8");
          });
        })
        .on("close", () => {
          resolve(files);
        }) as unknown as WritableStream<any>
    );
  }
  catch (error) {
    reject(error);
  }
});

export default extractTarball;
