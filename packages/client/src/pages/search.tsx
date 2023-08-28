import { type Component, createSignal, onMount } from "solid-js";
import { A, useSearchParams } from "@solidjs/router";
import { api } from "@/api";
import { Title } from "@solidjs/meta";

const SearchResults: Component = () => {
  const [params] = useSearchParams<{ name: string }>();
  const [loading, setLoading] = createSignal(true);
  const [page, setPage] = createSignal(0);
  const [results, setResults] = createSignal<Array<{package: {name: string, description: string, version: string, isCompatible: boolean | null}}> | null>(null);

  onMount(async () => {
    const { data } = await api.search.get({ $query: { name: params.name, page: page().toString() } });
    if (data && data.success) {
      // Fetch compatibility data for each package
      const promises = data.data.objects.map((result: { package: { name: any; }; }) => 
        api.is_package_compatible.get({ $query: { name: result.package.name, only_use_cache: "true" } })
      );
      
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.data.success) {
          data.data.objects[index].package.isCompatible = result.value.data.compatible;
        }
      });

      batch(() => {
        setResults(data.data.objects);
        setLoading(false);
      });
    }
  });

  const loadMore = async () => {
    setPage(page() + 1);
    const { data } = await api.search.get({ $query: { name: params.name, page: page().toString() } });
    if (data && data.success) {
      const promises = data.data.objects.map((result: { package: { name: any; }; }) => 
        api.is_package_compatible.get({ $query: { name: result.package.name, only_use_cache: "true" } })
      );
      
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.data.success) {
          data.data.objects[index].package.isCompatible = result.value.data.compatible;
        }
      });
      
      //@ts-ignore
      setResults(prevResults => [...prevResults, ...data.data.objects]);
    }
  };

  return (
    <>
    <Title>Search - Does it Bun?</Title>

    <div class="p-6">
      <A href="/" class="ml-6 flex flex-row items-center gap-1 text-subtle hover:text-accent transition">
        <IconMdiArrowLeft class="h-5 w-5" />
        Go back
      </A>
      <main class="flex items-center self-center justify-center mx-auto min-w-2xl max-w-3xl">
        <div class="mx-auto w-full z-10">
          <h1 class="text-4xl font-bold mb-4 text-left">Search results: <span class="text-accent">{params.name}</span></h1>
          <Show when={!loading()} fallback={"Loading..."}>
            <For each={results()}>
              {result => (
                <Show when={result}>
                  <div class="my-3 p-4 rounded-md bg-black-800 hover:bg-black-700 w-full border border-black-700 hover:border-accent/30">
                    <A href={`/package?name=${result.package.name}`} >
                      <div class="flex flex-row justify-between">
                        <div class="flex flex-row items-baseline gap-2">
                          <h2 class="font-semibold text-xl text-accent-light">{result.package.name}</h2>
                          <p class="text-subtle">v{result.package.version}</p>
                        </div>
                        <Switch>
                          <Match when={result.package.isCompatible === true}><span class="text-green-4">Compatible</span></Match>
                          <Match when={result.package.isCompatible === false}><span class="text-red-4">Not Compatible</span></Match>
                        </Switch>
                      </div>
                      <p class="text-subtext">{result.package.description}</p>
                    </A>
                  </div>
                </Show>
              )}
            </For>
            <button onClick={loadMore} class="mt-4 px-4 py-2 bg-accent-light/80 hover:bg-accent-light/65 transition rounded-md">Load More</button>
          </Show>
        </div>
      </main>
    </div>
    </>
  );
}

export default SearchResults;