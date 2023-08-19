import { type Component, createSignal, createEffect, on } from "solid-js";
import { useSearchParams, useNavigate } from "@solidjs/router";
import { api } from "@/api";

const Page: Component = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams<{
    name: string
  }>();

  const [scanResult, setScanResult] = createSignal<any | null>(null)

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

    setScanResult(data);
  }))

  return (
    <div>
      {JSON.stringify(scanResult())}
    </div>
  )
}

export default Page;
