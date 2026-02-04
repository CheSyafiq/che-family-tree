/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3C50E0',
        secondary: '#8B5CF6',
        accent: '#10B981',
      },
    },
  },
  plugins: [],
}
