/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#070913',
          card: '#0D1126',
          panel: '#121833',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-bright': 'rgba(139, 92, 246, 0.3)',
        },
        ai: {
          violet: '#8B5CF6',
          'violet-light': '#A78BFA',
          'violet-dark': '#6D28D9',
          indigo: '#6366F1',
          cyan: '#38BDF8',
          blue: '#3B82F6',
          glow: 'rgba(139, 92, 246, 0.15)',
        },
        brand: {
          teal: '#8B5CF6',
          'teal-light': '#A78BFA',
          'teal-dark': '#6D28D9',
          'teal-50': 'rgba(139, 92, 246, 0.1)',
          'teal-100': 'rgba(139, 92, 246, 0.2)',
        },
        surface: {
          bg: '#070913',
          card: '#0D1126',
          muted: '#151C3B',
        },
        content: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.25)',
        card: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        hover: '0 12px 40px -4px rgba(139, 92, 246, 0.25)',
        glow: '0 0 35px -5px rgba(139, 92, 246, 0.35)',
        'glow-blue': '0 0 35px -5px rgba(56, 189, 248, 0.35)',
      },
    },
  },
  plugins: [],
};
