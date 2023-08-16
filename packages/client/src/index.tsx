import { render } from 'solid-js/web'
import { Router, useRoutes } from '@solidjs/router'
import routes from '~solid-pages'
import 'virtual:uno.css'
import "@unocss/reset/tailwind.css";

render(
  () => {
    const Routes = useRoutes(routes)
    return (
      <div>
        <h1>Pogo</h1>
        <Router>
          <Routes />
        </Router>
      </div>
    )
  },
  document.getElementById('root') as HTMLElement,
)