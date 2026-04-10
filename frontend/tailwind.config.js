/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        mono: ['"Courier Prime"', 'monospace'],
      },
      colors: {
        navy:  '#0a0a1a',
        deep:  '#050510',
        gold:  '#f5c842',
        'gold-light': '#ffe97a',
        'neon-blue':  '#00d4ff',
        'neon-green': '#00ff88',
        'neon-red':   '#ff3366',
        'neon-yellow':'#ffee00',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
