/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "rgb(var(--color-space-950) / <alpha-value>)",
          900: "rgb(var(--color-space-900) / <alpha-value>)",
          800: "rgb(var(--color-space-800) / <alpha-value>)",
          750: "rgb(var(--color-space-750) / <alpha-value>)",
          700: "rgb(var(--color-space-700) / <alpha-value>)",
          600: "rgb(var(--color-space-600) / <alpha-value>)",
        },
        sidebar: "rgb(var(--color-sidebar) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          hover: "rgb(var(--color-accent-hover) / <alpha-value>)",
          foreground: "rgb(var(--color-accent-text) / <alpha-value>)",
          muted: "rgb(var(--color-accent-muted) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
