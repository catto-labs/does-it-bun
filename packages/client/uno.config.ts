import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [
    presetUno()
  ],
  
  theme: {
    colors: {
      "black-900": "#191724",
      "black-800": "#1f1d2e",
      "black-700": "#26233a",
      "black-600": "#6e6a86",
      "text": "#e0def4",
      "subtext": "#c2c0d8",
      "subtle": "#908caa",
      "muted": "#6e6a86",
      "accent-light": "#9ccfd8",
      "accent": "#425ced",
      "accent-darker": "#2c3382"
    },
    fontFamily: {
      sans: "DM Sans"
    }
  }
});
