import type { FileFromTarball } from "@/tarball/types";

const shouldBeIgnored = (path: string) => {
  const isJavaScriptFile = path.endsWith(".js")
  || path.endsWith(".mjs")
  || path.endsWith(".cjs");
  const isTypeScriptFile = path.endsWith(".ts");
  
  if (!isJavaScriptFile && !isTypeScriptFile) return true;
  return false;
}

export interface ScannedFile {
  path: string
  ignored: false
  issues: Array<unknown>
}

export interface IgnoredFile {
  path: string
  ignored: true
}

export const scanFile = (file: FileFromTarball): (ScannedFile | IgnoredFile) => {
  // Make sure this is a file to check.
  if (shouldBeIgnored(file.path)) return ({
    path: file.path,
    ignored: true
  } satisfies IgnoredFile);
  
  // Setup the output data.
  const output: ScannedFile = {
    path: file.path,
    ignored: false,
    issues: []
  };
  
  return output;
};
