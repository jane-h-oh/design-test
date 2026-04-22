/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D5A27',
          light: '#4A7C43',
          dark: '#1E3D1A',
        },
        secondary: {
          DEFAULT: '#8B4513',
          light: '#A0522D',
        },
        accent: {
          DEFAULT: '#D4A574',
          light: '#E5C4A1',
        },
        background: '#FAFAF8',
        surface: '#FFFFFF',
        border: '#E5E5E0',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
