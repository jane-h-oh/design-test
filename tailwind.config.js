/** @type {import('tailwindcss').Config} */
import polarisPreset from '@polaris/ui/tailwind';
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@polaris/ui/dist/**/*.{js,cjs}",
  ],
  presets: [polarisPreset],
  theme: {
    extend: {
      colors: {
        // Polaris Office NOVA — Brand Blue
        primary: {
          50:  '#EEF2FF',
          100: '#C7D4FF',
          200: '#97B8FF',
          300: '#6F70FF',
          400: '#4186FF',
          500: '#2863EB',
          600: '#1A4DD4',
          700: '#1539A8',
          800: '#10297B',
          900: '#0A1A52',
          DEFAULT: '#2863EB',
        },
        // Polaris Neutral Gray
        slate: colors.slate,
        neutral: {
          50: '#F4F4F6',
          100: '#E4E4E7',
          200: '#D4D4D8',
          300: '#A1A1AA',
          400: '#71717A',
          500: '#52525B',
          600: '#3F3F46',
          700: '#27272A',
          800: '#18181B',
          900: '#0C0C0E',
        },
        background: '#F6F7FF',
        surface: '#ffffff',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        // AI Main Gradient: 135deg Blue→Purple→Pink
        'nova-main': 'linear-gradient(135deg, #3B6EFF 0%, #8B5CF6 55%, #EC4899 100%)',
        // Secondary: 135deg Blue→Purple
        'nova-secondary': 'linear-gradient(135deg, #3B6EFF 0%, #7C3AED 100%)',
        // Hero dark bg
        'nova-dark': 'linear-gradient(180deg, #0D0F1A 0%, #141519 100%)',
      },
    },
  },
  plugins: [],
}
