module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif']
      },
      colors: {
        muted: '#94a3b8'
      }
    }
  },
  plugins: [ /* keep empty or add plugins you use */ ]
};
