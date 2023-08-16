import { Component } from "solid-js"

const Home: Component = () => {
    return (
        <div class="flex flex-col w-full h-full items-center pt-48"> 
            <h1 class=" text-5xl font-extrabold underline-accent underline underline-wavy mb-2">Does it Bun?</h1>
            <h2 class="text-lg text-subtle">Easily check if your package is compatible with Bun.</h2>
            <input class="mt-8 rounded-md px-3 py-2 h-12 w-xl bg-black-800" placeholder="Enter a package name..."></input>
        </div>
    );
}

export default Home;