import type { ParseResult } from "@babel/parser";
import type { File } from "@babel/types";

import { BUN_BUILT_IN_MODULES_NOT_IMPLEMENTED } from "../references/bun";

export type ScanResult = (
  | { is_issue: true, from: string, description: string }
  | { is_issue: false }
)

const nodeifyModuleName = (module_name: string): string => {
  if (!module_name.startsWith("node:")) (module_name = "node:" + module_name);
  return module_name;
}

const isModuleNoted = (module_name: string): boolean => {
  return module_name in BUN_BUILT_IN_MODULES_NOT_IMPLEMENTED;
}

const checkMethodFromModule = (method_name: string, module_name: string): ScanResult => {
  const module_notes = BUN_BUILT_IN_MODULES_NOT_IMPLEMENTED[module_name];

  if (typeof module_notes.implemented !== "undefined") {
    if (module_notes.implemented.length === 0) return {
      is_issue: true,
      from: module_name,
      description: "Not implemented."
    };

    else {
      if (module_notes.implemented.includes(method_name)) return {
        is_issue: false
      };

      return {
        is_issue: true,
        from: module_name,
        description: `${method_name} not implemented.`
      };
    }
  }

  if (typeof module_notes.not_implemented !== "undefined") {
    if (module_notes.not_implemented.length === 0) return {
      is_issue: false
    };

    else {
      if (!module_notes.not_implemented.includes(method_name)) return {
        is_issue: false
      };

      return {
        is_issue: true,
        from: module_name,
        description: `${method_name} not implemented.`
      };
    }
  }

  return {
    is_issue: false
  };
}

export const scan = (code: ParseResult<File>) => {
  const issues: Array<Record<string, unknown>> = [];
  const body = code.program.body;

  for (const declaration of body) {
    /** import ... from ... */
    if (declaration.type === "ImportDeclaration") {
      const module_name = nodeifyModuleName(declaration.source.value);
      if (!isModuleNoted(module_name)) continue;

      for (const specifier of declaration.specifiers) {
        if (specifier.type !== "ImportSpecifier") continue;
        if (specifier.imported.type !== "Identifier") continue;

        const method_name = specifier.imported.name;
        const check_result = checkMethodFromModule(method_name, module_name);
        if (!check_result.is_issue) continue;
        issues.push(check_result);
      }
    }
  }

  return issues;
}
