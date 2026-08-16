/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        background: '#0f1418',
        foreground: '#f0f2f5',
        card: '#141a1f',
        primary: '#20b2a6',
        'primary-foreground': '#0f1418',
        secondary: '#1f2830',
        'secondary-foreground': '#20b2a6',
        muted: '#252e37',
        'muted-foreground': '#a0aec0',
        border: '#242b32',
        highlight: '#f5a623',
        surface: '#1a2329',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    }
  },
  plugins: [],
}
