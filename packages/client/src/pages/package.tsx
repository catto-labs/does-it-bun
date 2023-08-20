import { type Component, createSignal, createEffect, on, For, Show } from "solid-js";
import { useSearchParams, useNavigate } from "@solidjs/router";
import { api } from "@/api";

import type { IgnoredFile, ScannedFile } from "../../../server/src/scan";

const Page: Component = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams<{ name: string }>();
  const [scanResult, setScanResult] = createSignal<Array<(ScannedFile | IgnoredFile)> | null>(null)

  createEffect(on(() => params.name, async () => {
    if (!params.name) {
      navigate("/");
      return;
    }

    const { data } = await api.scan.get({
      $query: {
        name: params.name
      }
    });

    if (!data) {
      alert("an error was made server-side, going back to home page.");
      navigate("/");
      return;
    }

    setScanResult(data.data);
  }))

  return (
    <div class="min-h-screen h-full p-6 flex flex-col justify-center items-center">
      <h1 class="mx-auto text-center mb-6 text-2xl">
        {params.name}@latest
      </h1>
      <div class="flex flex-col gap-6">
        <For each={scanResult()}>
          {item => (
            <Show when={!item.ignored && item}>
              {result => (
                <div class="flex flex-col gap-2 bg-black-800 px-8 py-6 rounded-lg">
                  <h3 class="text-lg font-semibold">
                    {item.path}
                  </h3>
                  <div class="flex flex-col gap-1">
                    <For each={result().issues} fallback={
                      <p>No issues!</p>
                    }>
                      {issue => (
                        <p>From {issue.from}, {issue.description}.</p>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </Show>
          )}
        </For>
      </div>
    </div>
  )
}

export default Page;
