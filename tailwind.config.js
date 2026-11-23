/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        display: ['"Archivo Black"', 'Impact', 'sans-serif'],
      },
      colors: {
        ink: '#0a0a0a',
        paper: '#f4f0e6',
        acid: '#d4ff00',
        hot: '#ff3d71',
        sky: '#3d7bff',
        sun: '#ffd400',
      },
      boxShadow: {
        brut: '6px 6px 0 0 #0a0a0a',
        'brut-lg': '10px 10px 0 0 #0a0a0a',
        'brut-sm': '3px 3px 0 0 #0a0a0a',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: { marquee: 'marquee 18s linear infinite' },
    },
  },
  plugins: [],
};
