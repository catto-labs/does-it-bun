import type { ParseResult } from "@babel/parser";
import type { File, ImportDeclaration, VariableDeclaration, Statement } from "@babel/types";

import { BUN_BUILT_IN_MODULES_NOTES } from "../references/bun";

export type ScanResult = (
  | { is_issue: true, from: string, description: string }
  | { is_issue: false }
)

const nodeifyModuleName = (module_name: string): string => {
  if (!module_name.startsWith("node:")) (module_name = "node:" + module_name);
  return module_name;
}

const isModuleNoted = (module_name: string): boolean => {
  return module_name in BUN_BUILT_IN_MODULES_NOTES;
}

const checkMethodFromModule = (method_name: string, module_name: string): ScanResult => {
  const module_notes = BUN_BUILT_IN_MODULES_NOTES[module_name];

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

type ScanIssues = Array<ScanResult>;
type ScanVariables = Record<string, string>;

type ScannedBlock = {
  variables: ScanVariables
  issues: ScanIssues
}

type ScanFunction<T extends Statement> = (block: T, variables: ScanVariables, issues: ScanIssues) => ScannedBlock;

/**
 * // Can be directly flagged:
 * import { Something } from "crypto";
 * 
 * // Should be tracked:
 * import crypto from "crypto";
 * import * as crypto from "crypto";
 * // because it can use a flagged property later...
 * TODO: const Something = crypto.Something;
 */
const scanImportDeclaration: ScanFunction<ImportDeclaration> = (block, variables, issues) => {
  const module_name = nodeifyModuleName(block.source.value);
  if (!isModuleNoted(module_name)) return { issues, variables };

  for (const specifier of block.specifiers) {
    switch (specifier.type) {
      case "ImportSpecifier": {
        const imported = specifier.imported;
        if (imported.type !== "Identifier") continue;

        const method_name = imported.name;
        const check_result = checkMethodFromModule(method_name, module_name);
        
        if (!check_result.is_issue) continue;
        issues.push(check_result);
        
        break;
      }
      // import crypto from "crypto";
      case "ImportDefaultSpecifier":
      // import * as crypto from "crypto";
      case "ImportNamespaceSpecifier":
        variables[specifier.local.name] = module_name;
        break;
    }
  }

  return { issues, variables };
}

/**
 * // Can be directly flagged:
 * const { Something } = require("crypto");
 * TODO: const Something = require("crypto").Something;
 * 
 * // Should be tracked:
 * const crypto = require("crypto");
 * // because it can use a flagged property later...
 * TODO: const Something = crypto.Something;
 */
const scanVariableDeclaration: ScanFunction<VariableDeclaration> = (block, variables, issues) => {
  for (const declaration of block.declarations) {
    const initializer = declaration.init;
    // If the variable is not declared, we don't care about it, yet...
    if (!initializer) continue;

    // `require()` is a function, so if the initializer is not calling a function, it shouldn't be a `require`.
    if (initializer.type !== "CallExpression") continue;
    if (initializer.callee.type !== "Identifier") continue;

    // We check if the function called is named `require`.
    if (initializer.callee.name !== "require") continue;

    // We get the module name using the first argument.
    const first_argument = initializer.arguments[0];
    if (first_argument.type !== "StringLiteral") continue;
    const module_name = nodeifyModuleName(first_argument.value);

    // Here, we're in that case: `const variableName = require("crypto")`
    // Where `variableName` is `declaration.id.name`.
    if (declaration.id.type === "Identifier") {
      variables[declaration.id.name] = module_name;
    }
    // Here, we're in that case: `const { Something } = require("crypto")`
    else if (declaration.id.type === "ObjectPattern") {
      for (const property of declaration.id.properties) {
        // TODO: Implement checking for `RestElement`.
        if (property.type !== "ObjectProperty") continue;
        if (property.key.type !== "Identifier") continue;

        const method_name = property.key.name;
        const check_result = checkMethodFromModule(method_name, module_name);
        if (!check_result.is_issue) continue;
        issues.push(check_result);
      }
    }
  }

  return { variables, issues };
}

export const scan = (code: ParseResult<File>) => {
  const body = code.program.body;

  // Initialize the values at the start of the scan.
  let variables: ScanVariables = {};
  let issues: ScanIssues = [];

  // Go for the analyze from start to end of the file.
  for (const block of body) {
    const handle = <T extends Statement>(fn: ScanFunction<T>) => {
      const results = fn(block as T, variables, issues);

      // Update the local variables.
      variables = results.variables;
      issues = results.issues
    };

    switch (block.type) {
      case "ImportDeclaration":
        handle(scanImportDeclaration);
        break;
      case "VariableDeclaration":
        handle(scanVariableDeclaration);
        break;
    }
  }

  console.log(issues, variables);

  return issues;
}
