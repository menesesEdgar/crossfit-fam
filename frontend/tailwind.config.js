/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      extend: {
        fontFamily: {
          sans: ["Roboto Condensed", "sans-serif"],
        },
  
        colors: {
          'mycad-danger': '#EF476F',
          'mycad-warning': '#FFD166',
          'mycad-success': '#06D6A0',
          'mycad-info': '#118AB2',
          'mycad-primary': '#680747',
          'mycad-secondary': '#980a68',
          'mycad-dark': '#141010',
          'mycad-light': '#FFFFFE',
          'mycad-gray': '#302727',
          'mycad-blue-dark': '#380426',
          'mycad-gray-dark': '#44403c',
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
    },
  }
  },
  plugins: [flowbite.plugin()],
};
