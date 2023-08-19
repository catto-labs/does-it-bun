import { type Component, createSignal, type JSX } from "solid-js"
import { useNavigate } from "@solidjs/router";

const Home: Component = () => {
  const [packageName, setPackageName] = createSignal("");
  const navigate = useNavigate();

  const formHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (event) => {
    event.preventDefault();
    navigate(`/package?name=${packageName()}`);
  }

  return (
    <form class="flex flex-col w-full h-full items-center pt-48"
      onSubmit={formHandler}
    > 
      <h1 class=" text-5xl font-extrabold underline-accent underline underline-wavy mb-2">Does it Bun?</h1>
      <h2 class="text-lg text-subtext">Easily check if your package is compatible with Bun.</h2>
      <input
        class="mt-8 rounded-md px-3 py-2 h-12 w-xl bg-black-800"
        placeholder="Enter a package name..."
        value={packageName()}
        onInput={(event) => setPackageName(event.currentTarget.value)}  
      />
    </form>
  );
}

export default Home;
