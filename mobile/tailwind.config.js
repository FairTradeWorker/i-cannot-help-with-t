/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e7ff',
          300: '#66dbff',
          400: '#33cfff',
          500: '#00c3ff', // Vibrant cyan
          600: '#009ecc',
          700: '#007699',
          800: '#004f66',
          900: '#002733',
        },
        secondary: {
          50: '#e6fff7',
          100: '#ccffef',
          200: '#99ffdf',
          300: '#66ffcf',
          400: '#33ffbf',
          500: '#00e6a8', // Vibrant teal
          600: '#00b885',
          700: '#008a63',
          800: '#005c42',
          900: '#002e21',
        },
        accent: {
          50: '#f5e6ff',
          100: '#ebccff',
          200: '#d699ff',
          300: '#c266ff',
          400: '#ad33ff',
          500: '#9900ff', // Vibrant purple
          600: '#7a00cc',
          700: '#5c0099',
          800: '#3d0066',
          900: '#1f0033',
        },
        success: {
          50: '#e6fff0',
          100: '#ccffe1',
          500: '#00e676', // Vibrant green
          600: '#00b85c',
        },
        warning: {
          50: '#fff9e6',
          100: '#fff3cc',
          500: '#ffb300', // Vibrant amber
          600: '#cc8f00',
        },
        danger: {
          50: '#ffe6e6',
          100: '#ffcccc',
          500: '#ff4444', // Vibrant red
          600: '#cc3636',
        },
        dark: {
          background: '#1a1a2e',
          card: '#25253a',
          border: '#3a3a52',
          muted: '#4a4a68',
        },
      },
    },
  },
  plugins: [],
};
