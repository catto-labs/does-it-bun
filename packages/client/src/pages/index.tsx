import { type Component, createSignal, type JSX } from "solid-js"
import { useNavigate } from "@solidjs/router";
import "./index.css"

const Home: Component = () => {
  const [packageName, setPackageName] = createSignal("");
  const navigate = useNavigate();

  const formHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (event) => {
    event.preventDefault();
    navigate(`/package?name=${packageName()}`);
  }

  return (
    <form class="flex flex-col w-full h-full items-center pt-36"
    
      onSubmit={formHandler}
    > 
      <h1 class=" text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-accent to-accent-light mb-2">Does it Bun?</h1>
      <h2 class="text-lg text-subtext">Easily check if your package is compatible with Bun.</h2>
      <div class="flex flex-row items-center mt-8 p-1 rounded-md bg-black-800">
        <IconMdiSearch class="mx-2 ml-4 mr-2 text-subtle" />
        <input
          class="px-2 py-1 h-12 w-xl bg-black-800 focus:outline-none"
          placeholder="Search package..."
          value={packageName()}
          onInput={(event) => setPackageName(event.currentTarget.value)}
        />
      </div>
    </form>
  );
}


export default Home;
