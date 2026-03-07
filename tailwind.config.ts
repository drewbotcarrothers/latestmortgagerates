import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Professional Financial Color Palette
        primary: {
          DEFAULT: '#0f172a', // Deep Navy
          light: '#1e293b',
          dark: '#020617',
        },
        accent: {
          DEFAULT: '#0891b2', // Teal/Cyan
          light: '#22d3ee',
          dark: '#0e7490',
        },
        success: {
          DEFAULT: '#059669', // Deep Emerald
          light: '#10b981',
        },
        highlight: {
          DEFAULT: '#d97706', // Amber/Gold
          light: '#f59e0b',
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
