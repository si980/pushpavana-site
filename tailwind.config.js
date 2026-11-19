/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#083C26',
        deep:   '#002917',
        cream:  '#FAF7EE',
        sage:   '#EAF3DE',
        muted:  '#456F5C',
        gold:   '#C6A56A',
        ink:    '#1D2C20',
        line:   '#D9DDCF',
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
