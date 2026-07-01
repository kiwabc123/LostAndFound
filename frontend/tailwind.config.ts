import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
      },
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#E0EDFF',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
        },
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}

export default config
