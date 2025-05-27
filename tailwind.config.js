module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './public/index.html',
  ],
  darkMode: 'media', // or 'class'
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
