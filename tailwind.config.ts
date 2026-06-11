import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        grotesk: ["var(--font-space-grotesk)", "monospace"],
        display: ["var(--font-space-grotesk)", "monospace"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          cyan: "#00f0ff",
          pink: "#ff2d95",
          purple: "#7c3aed",
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
        glass: {
          light: "rgba(255,255,255,0.05)",
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.12)",
          border: "rgba(255,255,255,0.1)",
        },
      },
      backgroundImage: {
        "neon-gradient":
          "linear-gradient(135deg, #ff2d95 0%, #7c3aed 50%, #00f0ff 100%)",
        "neon-gradient-subtle":
          "linear-gradient(135deg, rgba(255,45,149,0.3) 0%, rgba(124,58,237,0.3) 50%, rgba(0,240,255,0.3) 100%)",
        "glass-gradient":
          "linear-gradient(145deg, rgba(24,24,37,0.9), rgba(17,17,27,0.95))",
      },
      boxShadow: {
        "neon-cyan": "0 0 10px #00f0ff, 0 0 40px rgba(0,240,255,0.25)",
        "neon-pink": "0 0 10px #ff2d95, 0 0 40px rgba(255,45,149,0.25)",
        "neon-purple": "0 0 10px #7c3aed, 0 0 40px rgba(124,58,237,0.25)",
        "neon-green": "0 0 10px #39ff14, 0 0 40px rgba(57,255,20,0.25)",
        "neon-glow": "0 0 15px currentColor",
        glass: "0 8px 32px rgba(0,0,0,0.3)",
        "glass-sm": "0 4px 16px rgba(0,0,0,0.2)",
        card: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite alternate",
        "neon-flicker": "neon-flicker 3s linear infinite",
        shimmer: "shimmer 2s infinite linear",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "menu-in": "menu-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "menu-out": "menu-out 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "glow-pulse": {
          "0%": { boxShadow: "0 0 5px currentColor" },
          "100%": {
            boxShadow: "0 0 20px currentColor, 0 0 40px currentColor",
          },
        },
        "neon-flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "menu-in": {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "menu-out": {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        // ── Glass card ──
        ".glass": {
          background: "rgba(24, 24, 37, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "0.75rem",
        },
        ".glass-strong": {
          background: "rgba(17, 17, 27, 0.9)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "0.75rem",
        },
        ".glass-subtle": {
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "0.75rem",
        },

        // ── Neon text ──
        ".text-glow-cyan": {
          textShadow: "0 0 7px #00f0ff, 0 0 20px rgba(0,240,255,0.5)",
        },
        ".text-glow-pink": {
          textShadow: "0 0 7px #ff2d95, 0 0 20px rgba(255,45,149,0.5)",
        },
        ".text-glow-purple": {
          textShadow: "0 0 7px #7c3aed, 0 0 20px rgba(124,58,237,0.5)",
        },

        // ── Neon borders ──
        ".border-glow-cyan": {
          boxShadow:
            "0 0 8px rgba(0,240,255,0.4), inset 0 0 8px rgba(0,240,255,0.1)",
        },
        ".border-glow-pink": {
          boxShadow:
            "0 0 8px rgba(255,45,149,0.4), inset 0 0 8px rgba(255,45,149,0.1)",
        },
        ".border-glow-purple": {
          boxShadow:
            "0 0 8px rgba(124,58,237,0.4), inset 0 0 8px rgba(124,58,237,0.1)",
        },

        // ── Neon gradient text ──
        ".text-neon-gradient": {
          background:
            "linear-gradient(135deg, #ff2d95 0%, #7c3aed 50%, #00f0ff 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },

        // ── Skeleton shimmer ──
        ".skeleton": {
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s infinite linear",
          borderRadius: "0.5rem",
        },

        // ── Scrollbar hide ──
        ".scrollbar-hide": {
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
        },
      });
    }),
  ],
};
export default config;
