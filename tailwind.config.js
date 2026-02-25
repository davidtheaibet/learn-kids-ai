/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kids-purple': '#9B59B6',
        'kids-blue': '#3498DB',
        'kids-green': '#2ECC71',
        'kids-yellow': '#F1C40F',
        'kids-orange': '#E67E22',
        'kids-red': '#E74C3C',
        'kids-pink': '#FF6B9D',
      },
      fontFamily: {
        'rounded': ['Nunito', 'Comic Sans MS', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
}
