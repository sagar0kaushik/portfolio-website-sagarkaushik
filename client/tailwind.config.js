/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          primary: '#F3F0E6',
          cream: '#E9E5D8',
          dark: '#DDD8C8'
        },
        forest: {
          DEFAULT: '#073B32',
          primary: '#0B332B',
          deep: '#073B32',
          dark: '#164B40',
          muted: '#718078'
        },
        cobalt: {
          DEFAULT: '#315BDD',
          primary: '#315BDD',
          secondary: '#2448B8',
          glow: 'rgba(49, 91, 221, 0.15)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Space Mono"', '"JetBrains Mono"', 'monospace'],
        display: ['Inter', 'Geist', 'Helvetica Neue', 'sans-serif']
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.03em',
        widest: '0.18em'
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}
