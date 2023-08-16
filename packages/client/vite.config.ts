import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import Pages from "vite-plugin-pages";

import Icons from "unplugin-icons/vite"
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'

import UnoCSS from 'unocss/vite'
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    UnoCSS(),
    Pages(),
    AutoImport({
      resolvers: [
        IconsResolver({
          prefix: 'Icon',
          extension: 'tsx',
        }),
      ],
    }),
    Icons({ compiler: 'solid' })
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
