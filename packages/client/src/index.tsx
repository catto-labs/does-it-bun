/* @refresh reload */
import "@unocss/reset/tailwind.css";
import "@fontsource/dm-sans";
import 'virtual:uno.css'

import { render } from 'solid-js/web'
import { Router, useRoutes } from '@solidjs/router'

import routes from '~solid-pages'

render(
  () => {
    const Routes = useRoutes(routes);
    
    return (
      <div class="min-h-screen h-full bg-black-900 text-text font-sans">
        <Router>
          <Routes />
        </Router>
      </div>
    )
  },
  document.getElementById('root') as HTMLDivElement
);
