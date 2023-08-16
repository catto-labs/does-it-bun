import { render } from 'solid-js/web'
import { Router, useRoutes } from '@solidjs/router'
import routes from '~solid-pages'
import 'virtual:uno.css'
import "@unocss/reset/tailwind.css";
import "@fontsource/dm-sans";

render(
  () => {
    const Routes = useRoutes(routes)
    return (
      <div class="w-full h-screen bg-black-900 text-text font-sans">
        <Router>
          <Routes />
        </Router>
      </div>
    )
  },
  document.getElementById('root') as HTMLElement,
)