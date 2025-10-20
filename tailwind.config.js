/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // This object fixes the Framer Motion animation error.
      colors: {
        transparent: 'transparent',
      }
    },
  },
  plugins: [],
}