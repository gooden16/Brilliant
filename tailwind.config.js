/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#00112E',
        cream: '#F5F2E7',
        'medium-grey': '#999999',
        'light-medium-grey': '#CCCCCC',
        'light-grey': '#E5E5E5',
        gold: '#D4AF37',
        'dusty-pink': '#F4C6D7',
        'light-blue': '#ADD8E6',
        burgundy: '#A83440',
        'deep-olive': '#4C6652',
        'bronzed-orange': '#C27830',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}