/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#F5F7FB',
        surface: '#FFFFFF',
        navy: {
          900: '#0F243E',
          800: '#15345B', // Primary brand color
          700: '#1C4273',
          600: '#23528E',
          100: '#E8EFF7',
          50: '#F0F5FA',
        },
        brand: {
          blue: '#2563EB', // Accent
          light: '#EFF6FF',
          dark: '#1D4ED8',
        },
        status: {
          success: '#059669',
          'success-bg': '#ECFDF5',
          warning: '#D97706',
          'warning-bg': '#FFFBEB',
          danger: '#DC2626',
          'danger-bg': '#FEF2F2',
          neutral: '#4B5563',
          'neutral-bg': '#F3F4F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 2px 8px -2px rgba(21, 52, 91, 0.08), 0 1px 4px -1px rgba(21, 52, 91, 0.04)',
        elevated: '0 10px 25px -5px rgba(21, 52, 91, 0.12), 0 8px 10px -6px rgba(21, 52, 91, 0.08)',
      },
      borderRadius: {
        card: '12px',
      }
    },
  },
  plugins: [],
}

