/** @type {import('tailwindcss').Config} */
import polarisPreset from '@polaris/ui/tailwind';

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
        // Existing app aliases backed by Polaris tokens.
        primary: {
          50:  'var(--polaris-blue-5)',
          100: 'var(--polaris-blue-10)',
          200: 'var(--polaris-blue-20)',
          300: 'var(--polaris-blue-30)',
          400: 'var(--polaris-blue-40)',
          500: 'var(--polaris-blue-50)',
          600: 'var(--polaris-blue-60)',
          700: 'var(--polaris-blue-70)',
          800: 'var(--polaris-blue-80)',
          900: 'var(--polaris-blue-90)',
          DEFAULT: 'var(--polaris-accent-brand-normal)',
        },
        slate: {
          50: 'var(--polaris-neutral-50)',
          100: 'var(--polaris-neutral-100)',
          200: 'var(--polaris-neutral-200)',
          300: 'var(--polaris-neutral-300)',
          400: 'var(--polaris-neutral-400)',
          500: 'var(--polaris-neutral-500)',
          600: 'var(--polaris-neutral-600)',
          700: 'var(--polaris-neutral-700)',
          800: 'var(--polaris-neutral-800)',
          900: 'var(--polaris-neutral-900)',
        },
        neutral: {
          50: 'var(--polaris-neutral-50)',
          100: 'var(--polaris-neutral-100)',
          200: 'var(--polaris-neutral-200)',
          300: 'var(--polaris-neutral-300)',
          400: 'var(--polaris-neutral-400)',
          500: 'var(--polaris-neutral-500)',
          600: 'var(--polaris-neutral-600)',
          700: 'var(--polaris-neutral-700)',
          800: 'var(--polaris-neutral-800)',
          900: 'var(--polaris-neutral-900)',
        },
        background: 'var(--polaris-surface-canvas)',
        surface: 'var(--polaris-layer-surface)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'nova-main': 'var(--app-gradient-nova-main)',
        'nova-secondary': 'var(--app-gradient-nova-secondary)',
        'nova-dark': 'var(--app-gradient-nova-dark)',
      },
    },
  },
  plugins: [],
}
