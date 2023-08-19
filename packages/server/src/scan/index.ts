import type { FileFromTarball } from "@/tarball/types";
import { parse } from "@babel/parser";

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
  ast: string,
  issues: Array<unknown>
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

  const ast = parse(file.content, { sourceType: "unambiguous" });

  try {
    // Setup the output data.
    const output: ScannedFile = {
      path: file.path,
      ignored: false,
      issues: [],
      ast: JSON.stringify(ast.program)
    };
    
    return output;
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
