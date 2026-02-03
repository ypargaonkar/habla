/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#FAFAFA',
          dark: '#0A0A0A',
        },
        primary: {
          light: '#1A1A1A',
          dark: '#FFFFFF',
        },
        secondary: {
          light: '#6B7280',
          dark: '#9CA3AF',
        },
        accent: {
          DEFAULT: '#2563EB',
          light: '#2563EB',
          dark: '#3B82F6',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#16A34A',
          dark: '#22C55E',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#F59E0B',
          dark: '#FBBF24',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#DC2626',
          dark: '#EF4444',
        },
        border: {
          light: '#E5E7EB',
          dark: '#27272A',
        },
        card: {
          light: '#FFFFFF',
          dark: '#18181B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
