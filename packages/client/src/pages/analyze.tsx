import { type Component, createSignal, createEffect, on } from "solid-js";
import { Title } from "@solidjs/meta";

import { parse, type ParseResult } from "@babel/parser";
import type { File } from "@babel/types";

import { createCodeMirror, createEditorReadonly, createEditorControlledValue } from "solid-codemirror";
import { EditorView, lineNumbers } from '@codemirror/view';
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { rosePineDawn } from "thememirror";

import { scan } from "../../../server/src/scan/individual";

const Page: Component = () => {
  const [code, setCode] = createSignal(`// You can write code, and you'll see the parser's AST on the right panel.\n// On the bottom, you'll be able to see the possible incompatibilities with Bun.\n\nimport { Certificate } from "crypto";\nrequire("crypto");`);
  const [ast, setAST] = createSignal<ParseResult<File> | null>(null);

  let timeout: ReturnType<typeof setTimeout> | undefined;
  createEffect(on(code, (new_code) => {
    if (timeout) clearInterval(timeout);
    timeout = setTimeout(() => {
      console.log("run AST parser.");

      try {
        const ast = parse(new_code, {
          sourceType: "unambiguous"
        });
    
        setAST(ast);
      }
      catch (error) {
        setAST(null);
      }
  
    }, 500);
  }))

  const { ref: editorRef, createExtension: createEditorExtension } = createCodeMirror({
    value: code(),
    onValueChange: (value) => setCode(value)
  });

  const theme = EditorView.theme({
    '&': {
      // color: "white",
      // backgroundColor: "#1f1d29",
      overflow: "auto",
      height: "600px"
    },
    // ".cm-content": {
    //   caretColor: "#0e9"
    // },
    // "&.cm-focused .cm-cursor": {
    //   borderLeftColor: "#0e9"
    // },
    // "&.cm-focused .cm-selectionBackground, ::selection": {
    //   backgroundColor: "#074"
    // },
    // ".cm-gutters": {
    //   backgroundColor: "#292a3a",
    //   color: "#ddd",
    //   border: "none"
    // }
  }, { dark: true });

  const { ref: astReadRef, editorView: astReadEditorView, createExtension: createViewerExtension } = createCodeMirror();
  createEditorControlledValue(astReadEditorView, () => JSON.stringify(ast()?.program.body, null, 2));
  createEditorReadonly(astReadEditorView, () => true);

  createEditorExtension(theme);
  createViewerExtension(theme);
  createEditorExtension(rosePineDawn);
  createViewerExtension(rosePineDawn);
  createEditorExtension(javascript());
  createViewerExtension(json());
  createEditorExtension(lineNumbers());
  createViewerExtension(lineNumbers());

  return (
    <>
      <Title>
        Analyze - Does your code Bun?
      </Title>

      <main class="p-6">
        <p class="mx-auto text-center w-2xl mb-4">
          Only this page parses the code client-side.
          When you lookup for packages, it all happens server-side
          for caching/network reasons.
        </p>
        
        <div class="flex gap-8 justify-center">
          <div class="w-45% shrink-0" ref={editorRef} />
          <div class="w-45% shrink-0" ref={astReadRef} />
        </div>

        <Show when={ast()}>
          {code => (
            <For each={scan(code())}>
              {item => <p class="mt-2">{JSON.stringify(item)}</p>}
            </For>
          )}
        </Show>

      </main>
    </>
  )
};

export default Page;
