export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'] },
      colors: { brand: { 50: '#eff5ff', 100: '#dbe8fe', 500: '#2563eb', 600: '#1d4ed8', 700: '#1e40af' } },
    },
  },
  plugins: [],
}
