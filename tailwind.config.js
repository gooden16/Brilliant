/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#00112E',
        'cream': '#F5F2E7',
        'dusty-pink': '#F4C6D7',
        'burgundy': '#A83440',
        'deep-olive': '#4C6652',
        'gold': '#D4AF37',
        'light-blue': '#ADD8E6',
        'bronzed-orange': '#C27830',
        'medium-grey': '#999999',
        'charcoal-grey': '#333333',
        'light-grey': '#E5E5E5'
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif']
      },
      backgroundColor: {
        'navy': '#00112E',
        'navy-50': 'rgba(10, 26, 47, 0.5)',
        'white-5': 'rgba(255, 255, 255, 0.05)',
        'white-10': 'rgba(255, 255, 255, 0.1)',
        'white-20': 'rgba(255, 255, 255, 0.2)',
      }
    },
  },
  plugins: [],
}