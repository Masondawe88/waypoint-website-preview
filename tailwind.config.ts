import type { Config } from "tailwindcss";

/* Tailwind is available for FUTURE components only.
   Preflight is disabled so the existing page CSS is never altered. */
const config: Config = {
  corePlugins: { preflight: false },
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F1EEE7",
        charcoal: "#211F1B",
        metal: "#B3B0A7",
        "ink-soft": "#6D6A61",
        "wp-accent": "#5E6B75",
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Instrument Sans"', "-apple-system", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
