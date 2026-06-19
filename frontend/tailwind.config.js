/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00C896',
          dark: '#007A5E',
          light: '#E6FFF7',
        },
        accent: '#FFD700', // Gold
        background: '#F0FBF7',
        card: '#FFFFFF',
        surface: '#F7FFFE',
        text: {
          primary: '#0D1F1A',
          secondary: '#4A7C6F',
          muted: '#9ABFB5',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
}
