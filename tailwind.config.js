module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}', './public/index.html'],
  darkMode: 'media', // or 'class'
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif']
    },
    extend: {
      colors: {
        background: {
          DEFAULT: 'hsl(var(--background))',
          deep: 'hsl(var(--background-deep))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        foreground: {
          DEFAULT: 'hsl(var(--foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        normary: {
          DEFAULT: 'hsl(var(--normary))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))'
        }
      }
    }
  },
  plugins: [require('./tailwind.plugins.lang-variants.js')]
}
