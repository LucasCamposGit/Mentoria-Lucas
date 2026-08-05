module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(240 10% 3.9%)',
        foreground: 'hsl(0 0% 98%)',
        muted: 'hsl(240 3.7% 15.9%)',
        card: 'hsl(240 10% 6%)',
        border: 'hsl(240 3.7% 15.9%)',
        'glow-purple': 'hsl(270 80% 60%)',
        'glow-purple-light': 'hsl(270 80% 70%)',
        'glow-purple-dark': 'hsl(270 80% 45%)',
      },
    },
  },
  plugins: [],
}
