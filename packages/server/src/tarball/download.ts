import { Readable } from "node:stream";

export const downloadTarballAsReadable = async (tarball_url: string): Promise<Readable> => {
  const tarball_response = await fetch(tarball_url);
  return Readable.fromWeb(tarball_response.body!);
};
