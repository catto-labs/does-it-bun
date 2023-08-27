import { Component } from "solid-js";
import { Link } from "@solidjs/router";

const Header: Component = () => {
  return (
    <header class="fixed top-0 left-0 w-full bg-black-900/80 backdrop-blur-md text-text py-4 px-8 flex justify-between items-center">
      <Link href="/" class="text-2xl font-bold flex flex-row items-center gap-3">
        <img src="does_it_bun_icon.png" class=" h-12"></img>
        <span class="text-[20px]">Does it Bun?</span>
      </Link>
      <nav class="flex flex-row items-center">
        <Link href="/analyze" class="mr-4 hover:text-accent transition">Analyze</Link>
        <a href="https://github.com/catto-labs/does-it-bun" target="_blank" rel="noopener noreferrer">
          <IconMdiGithub class="w-8 h-8 hover:text-accent transition" />
        </a>
      </nav>
    </header>
  );
};

export default Header;
