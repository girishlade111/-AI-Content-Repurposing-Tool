import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        dark: {
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a25",
          600: "#252536",
          500: "#2d2d42",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-up": "slideInUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(245, 158, 11, 0.6)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #0a0a0f 0%, #1a1a25 50%, #0a0a0f 100%)",
        "amber-gradient":
          "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%)",
      },
      boxShadow: {
        "amber": "0 0 20px rgba(245, 158, 11, 0.3)",
        "amber-lg": "0 0 40px rgba(245, 158, 11, 0.25)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 12px 40px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;