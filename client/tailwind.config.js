/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          light: '#1A2A44',
          lighter: '#243554',
          dark: '#060E1A',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#D4BC72',
          dark: '#A88A3A',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
