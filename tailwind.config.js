/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        telemetry: {
          dark: '#0C0D0E',
          accent: '#FF5500',
        }
      }
    },
  },
  plugins: [],
}