/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0A1A2F',
        'cream': '#F5F5F4',
        'dusty-pink': '#E4A6A6',
        'burgundy': '#800020'
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif']
      },
      backgroundColor: {
        'navy': '#0A1A2F',
        'navy-50': 'rgba(10, 26, 47, 0.5)',
        'white-5': 'rgba(255, 255, 255, 0.05)',
        'white-10': 'rgba(255, 255, 255, 0.1)',
        'white-20': 'rgba(255, 255, 255, 0.2)',
      }
    },
  },
  plugins: [],
}