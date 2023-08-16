import { render } from 'solid-js/web'
import { Router, useRoutes } from '@solidjs/router'
import routes from '~solid-pages'
import 'virtual:uno.css'
import "@unocss/reset/tailwind.css";

render(
  () => {
    const Routes = useRoutes(routes)
    return (
      <div class="w-full h-screen bg-black-900 text-light-9">
        <Router>
          <Routes />
        </Router>
      </div>
    )
  },
  document.getElementById('root') as HTMLElement,
)