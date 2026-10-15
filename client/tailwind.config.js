/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#176B67',
          'teal-light': '#218E89',
          'teal-dark': '#104C49',
          'teal-50': '#F0F7F6',
          'teal-100': '#DCEFEB',
        },
        surface: {
          bg: '#F7F7F2',
          card: '#FFFFFF',
          muted: '#EFEFEA',
        },
        content: {
          primary: '#242A2A',
          secondary: '#66716F',
          muted: '#95A19F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(36, 42, 42, 0.04)',
        card: '0 4px 20px -2px rgba(23, 107, 103, 0.08)',
        hover: '0 10px 25px -5px rgba(23, 107, 103, 0.12)',
      },
    },
  },
  plugins: [],
};
