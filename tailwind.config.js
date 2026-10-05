/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900 - Elegante y oscuro
          light: '#334155',
        },
        accent: {
          DEFAULT: '#d4af37', // Dorado lujo
          hover: '#b5952f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // Para títulos elegantes
      }
    },
  },
  plugins: [],
}