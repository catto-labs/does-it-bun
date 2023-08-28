import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [
    presetUno()
  ],
  
  theme: {
    colors: {
      black: {
        900: "#0d0d0d",
        800: "#141414",
        700: "#1a1a1a",
        650: "#2b2b2b",
        600: "#313131",
        500: "#484848",
        400: "#5f5f5f",
        300: "#767676",
        200: "#a3a3a3",
        100: "#d1d1d1",
        50: "#e8e8e8"
      },
      "text": "#e0def4",
      "subtext": "#c2c0d8",
      "subtle": "#908caa",
      "muted": "#6e6a86",
      "accent-light": "#9ccfd8",
      "accent": "#425ced",
      "accent-darker": "#2c3382"
    },
    fontFamily: {
      sans: "Hanken Grotesk"
    }
  }
});
