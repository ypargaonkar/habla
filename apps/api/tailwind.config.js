/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        foreground: '#1A1A1A',
        accent: '#2563EB',
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626',
      },
    },
  },
  plugins: [],
};
