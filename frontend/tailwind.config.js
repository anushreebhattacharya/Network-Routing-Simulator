/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070b16',
          900: '#0b1224',
          800: '#111a33',
          700: '#182445',
        },
        cyan: {
          glow: '#22d3ee',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(34, 211, 238, 0.25)',
      },
    },
  },
  plugins: [],
};
