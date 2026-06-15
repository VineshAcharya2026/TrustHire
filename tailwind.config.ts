import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A1A2E",
          foreground: "#F8F7F4",
        },
        accent: {
          DEFAULT: "#E8B84B",
          foreground: "#1A1A2E",
        },
        surface: "#F8F7F4",
        success: "#2D6A4F",
        warning: "#E76F51",
        error: "#C1121F",
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#6B7280",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        landing: {
          blue: "#2563EB",
          blueDark: "#1D4ED8",
          blueLight: "#EFF6FF",
          navy: "#0F172A",
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(26 26 46 / 0.06), 0 1px 2px -1px rgb(26 26 46 / 0.06)",
        "card-hover": "0 4px 12px 0 rgb(26 26 46 / 0.08), 0 2px 4px -2px rgb(26 26 46 / 0.06)",
        subtle: "0 1px 2px 0 rgb(26 26 46 / 0.04)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
        "scale-in": "scale-in 0.25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
