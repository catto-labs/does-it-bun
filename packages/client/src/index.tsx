/* @refresh reload */
// We add the reference because for some reasons,
// adding `DOM` to the `.lib` in `tsconfig.json` isn't fixing the TS issues.
/// <reference lib="DOM" />

import "@unocss/reset/tailwind.css";
import "@fontsource/hanken-grotesk";
import 'virtual:uno.css'

import { render } from 'solid-js/web'
import { Router, useRoutes } from '@solidjs/router'
import { MetaProvider } from "@solidjs/meta";

import routes from '~solid-pages'
import Header from "./components/Header";

render(
  () => {
    const Routes = useRoutes(routes);
    
    return (
      <MetaProvider>
        <div class="min-h-screen h-full bg-black-bg text-text font-sans">
          <Router>
            <Header />
            <div class="pt-20">
              <Routes />
            </div>
          </Router>
        </div>
      </MetaProvider>
    )
  },
  document.getElementById('root') as HTMLDivElement
);
