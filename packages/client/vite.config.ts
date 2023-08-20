import { defineConfig } from 'vite';
import path from "node:path";

import solid from 'vite-plugin-solid';
import pages from "vite-plugin-pages";
import unocss from 'unocss/vite'

import icons from "unplugin-icons/vite"

import auto from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  plugins: [
    solid(),

    auto({
      imports: ["solid-js"],
      dts: "./src/auto-imports.d.ts",
      resolvers: [
        IconsResolver({
          prefix: 'Icon',
          extension: 'tsx',
        }),
      ],
    }),

    pages(),
    unocss(),
    icons({ compiler: 'solid' })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  
  server: {
    port: 3000,
  },

  build: {
    target: 'esnext',
  },

  optimizeDeps: {
    include: ['@codemirror/state', '@codemirror/view'],
  }
});
