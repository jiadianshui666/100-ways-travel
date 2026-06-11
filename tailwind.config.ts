import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Dark neon palette
        neon: {
          pink: "#ff2d95",
          cyan: "#00f0ff",
          purple: "#b347ea",
          green: "#39ff14",
          yellow: "#ffe600",
          orange: "#ff6b35",
        },
        dark: {
          50: "#e4e4e7",
          100: "#c5c5d2",
          200: "#a1a1b0",
          300: "#7c7c8f",
          400: "#58586d",
          500: "#33334c",
          600: "#1e1e2e",
          700: "#181825",
          800: "#11111b",
          900: "#0a0a0f",
          950: "#050508",
        },
      },
      boxShadow: {
        "neon-pink": "0 0 10px #ff2d95, 0 0 40px #ff2d9540",
        "neon-cyan": "0 0 10px #00f0ff, 0 0 40px #00f0ff40",
        "neon-purple": "0 0 10px #b347ea, 0 0 40px #b347ea40",
        "neon-green": "0 0 10px #39ff14, 0 0 40px #39ff1440",
        "glow": "0 0 15px currentColor",
      },
      textShadow: {
        neon: "0 0 7px currentColor, 0 0 10px currentColor",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite alternate",
        "neon-flicker": "neon-flicker 3s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%": { boxShadow: "0 0 5px currentColor" },
          "100%": { boxShadow: "0 0 20px currentColor, 0 0 40px currentColor" },
        },
        "neon-flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
