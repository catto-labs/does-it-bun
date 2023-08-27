import { type Component, createSignal, onMount } from "solid-js";
import { A, useSearchParams } from "@solidjs/router";
import { api } from "@/api";
import { Title } from "@solidjs/meta";

const SearchResults: Component = () => {
  const [params] = useSearchParams<{ name: string }>();
  const [results, setResults] = createSignal<Array<{package: {name: string, description: string, version: string,}}> | null>(null);

  onMount(async () => {
    const { data } = await api.search.get({ $query: { name: params.name } });
    if (data && data.success) {
      setResults(data.data.objects);
    }
  });

  return (
    <>
    <Title>Search - Does it Bun?</Title>

    <main class="p-6 flex items-center self-center justify-center mx-auto min-w-2xl max-w-3xl">
      <div class="mx-auto w-full">
        <h1 class="text-4xl font-bold mb-4 text-left">Search results: {params.name}</h1>
        <For each={results()}>
          {result => (
            <Show when={result}>
              <div class="my-3 p-4 rounded-md bg-black-800 hover:bg-black-700 w-full">
                <A href={`/package?name=${result.package.name}`} >
                  <div class="flex flex-row items-baseline gap-2">
                    <h2 class="font-semibold text-xl">{result.package.name}</h2>
                    <p class="text-subtle">v{result.package.version}</p>
                  </div>
                  <p class="text-subtext">{result.package.description}</p>
                </A>
              </div>
            </Show>
          )}
        </For>
      </div>
    </main>
    </>
  );
}

export default SearchResults;