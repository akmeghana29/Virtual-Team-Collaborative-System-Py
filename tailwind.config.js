export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#F8FAFC',
          surface: '#D9EAFD',
          border: '#BCCCDC',
          muted: '#9AA6B2',
        },
        dark: {
          bg: '#27374D',
          surface: '#526D82',
          border: '#9DB2BF',
          muted: '#DDE6ED',
        },
        accent: '#4F81C7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}