module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f172a", // Slate 900 - Deep Background
          light: "#1e293b",   // Slate 800 - Lighter Background
          dark: "#020617",    // Slate 950 - Darkest Background
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)", // Dynamic
          hover: "rgb(var(--color-accent-hover) / <alpha-value>)",   // Dynamic
          light: "rgb(var(--color-accent-light) / <alpha-value>)",   // Dynamic
        },
        secondary: "#94a3b8", // Slate 400 - Muted Text
        brand: {
          50: '#f5f7ff',
          100: '#e6eeff',
          500: '#4f46e5'
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/hero-bg.jpg')", // Placeholder
      },
      animation: {
        scroll: 'scroll 10s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }
    }
  },
  plugins: []
}
