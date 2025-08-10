/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff7ed",
          500: "#ff6b35",
          600: "#ea580c",
          700: "#c2410c",
        },
        secondary: {
          500: "#004225",
          600: "#003d20",
          700: "#00361c",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}

