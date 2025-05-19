/** @type {import('tailwindcss').Config} */
import hamburgers from 'tailwind-hamburgers';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        },
      },
    },
  plugins: [hamburgers],
};