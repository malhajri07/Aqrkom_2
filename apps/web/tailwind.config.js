/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Noto Kufi Arabic', 'Tajawal', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Noto Kufi Arabic', 'system-ui', 'sans-serif'],
      },
      colors: {
        holly: {
          50: '#f0f9f4',
          100: '#dbf0e3',
          200: '#bae0cc',
          300: '#8cc9ac',
          400: '#5cab88',
          500: '#3a8f6c',
          600: '#297255',
          700: '#215b46',
          800: '#1c4938',
          900: '#183c30',
          950: '#0d231c',
        },
        primary: {
          50: '#f0f9f4',
          100: '#dbf0e3',
          200: '#bae0cc',
          300: '#8cc9ac',
          400: '#5cab88',
          500: '#3a8f6c',
          600: '#297255',
          700: '#215b46',
          800: '#1c4938',
          900: '#183c30',
          950: '#0d231c',
        },
        accent: {
          gold: '#d4a853',
          sand: '#e8dcc4',
        },
      },
    },
  },
  plugins: [],
};
