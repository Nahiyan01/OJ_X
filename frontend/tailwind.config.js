/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        judge: {
          dark: '#090d16',
          panel: '#0e1422',
          surface: '#141c2e',
          card: '#182238',
          border: '#23304c',
          borderLight: '#2e3e60',
          accent: '#6366f1',
          accentHover: '#4f46e5',
          accentGlow: 'rgba(99, 102, 241, 0.15)',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          textMuted: '#94a3b8',
          textBright: '#f8fafc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.35)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
