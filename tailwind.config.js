/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      space: {
        900: "#0d0d0d",
        800: "#141417",
        700: "#1b1b1e",
      },
      sidebar:"#0f0f0f",
      border:"#2a2a2a",
      card:"#131313",
      input:"#1a1a1a",
      accent: "#0044ff", // electric blue like your reference
    },
  },
},
  plugins: [],
}

