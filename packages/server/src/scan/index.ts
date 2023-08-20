import type { FileFromTarball } from "@/tarball/types";
import { parse } from "@babel/parser";
import { scan } from "./individual";

const shouldBeIgnored = (path: string) => {
  const isJavaScriptFile = path.endsWith(".js")
  || path.endsWith(".mjs")
  || path.endsWith(".cjs");
  const isTypeScriptFile = path.endsWith(".ts") && !path.endsWith(".d.ts");;
  
  if (!isJavaScriptFile && !isTypeScriptFile) return true;
  return false;
}

export interface ScannedFile {
  path: string
  ignored: false
  issues: ReturnType<typeof scan>
}

export interface IgnoredFile {
  path: string
  ignored: true
  /** Special property telling that the file was ignored because of a parse error server-side. */
  from_parse_error?: boolean
  /** Available when `from_parse_error` is `true`. */
  parse_error?: unknown
}

export const scanFile = (file: FileFromTarball): (ScannedFile | IgnoredFile) => {
  // Make sure this is a file to check.
  if (shouldBeIgnored(file.path)) return ({
    path: file.path,
    ignored: true
  } satisfies IgnoredFile);

  try {
    const ast = parse(file.content, { sourceType: "unambiguous" });

    return ({
      path: file.path,
      ignored: false,
      issues: scan(ast),
    } satisfies ScannedFile);
  }
  catch (error) {
    return ({
      path: file.path,
      ignored: true,
      from_parse_error: true,
      parse_error: error
    } satisfies IgnoredFile)
  }
};
