/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto Condensed", "sans-serif"],
      },

      colors: {
        'crossfit-danger': '#EF476F',
        'crossfit-warning': '#FFD166',
        'crossfit-success': '#06D6A0',
        'crossfit-info': '#118AB2',
        'crossfit-primary': '#fc0689',
        'crossfit-secondary': '#45266a',
        'crossfit-dark': '#141010',
        'crossfit-light': '#FFFFFE',
        'crossfit-light-purple': '#643990',
        'crossfit-gray': '#e7e5e4',
        'crossfit-gray-dark': '#44403c',
        'crossfit-blue-dark': '#380426',
        'crossfit-light-pink': '#fd38a1',
        'crossfit-pink-dark': '#cc026e',
      },
      animation: {
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)',
          },
          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)',
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)',
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)',
          },
        },
      },
  }
  },
  plugins: [flowbite.plugin()],
};
