import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",               // Root files (App.tsx, etc.)
    "./components/**/*.{js,ts,jsx,tsx}", // Components folder
    "./services/**/*.{js,ts,jsx,tsx}",   // Services folder
  ],
  theme: {
    extend: {
      colors: {
        museum: {
          charcoal: '#1C1B1A', // Deep black-grey
          gold: '#C5A059',     // Muted antique gold
          paper: '#F9F8F6',    // Warm white
          stone: '#E6E2D3',    // Beige border color
          text: '#2C2C2C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C5A059 0%, #E5C57F 50%, #C5A059 100%)',
      },
      boxShadow: {
        'card': '0 10px 30px -10px rgba(28, 27, 26, 0.08)',
        'gold': '0 0 15px rgba(197, 160, 89, 0.2)',
      }
    },
  },
  plugins: [
    typography,
  ],
}