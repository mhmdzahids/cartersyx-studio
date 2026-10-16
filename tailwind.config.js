/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        canvas: 'var(--color-canvas)',
        'surface-alt': 'var(--color-surface-alt)',
        'surface-tint': 'var(--color-surface-tint)',
        'surface-tint-hover': 'var(--color-surface-tint-hover)',
        body: 'var(--color-body)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        'focus-ring': 'var(--color-focus-ring)',
        'inverse-bg': 'var(--color-inverse-bg)',
        'inverse-text': 'var(--color-inverse-text)',
        'inverse-muted': 'var(--color-inverse-muted)',
        'inverse-border': 'var(--color-inverse-border)',
      },
      fontFamily: {
        sans: [
          '"Geist Variable"',
          'saans',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      fontWeight: {
        regular: '400',
        medium: '456',
        semibold: '600',
        display: '652',
      },
      borderRadius: {
        none: '0px',
        link: '24px',
        card: '32px',
        pill: '9999px',
      },
      spacing: {
        xxs: '8px',
        xs: '20px',
        sm: '24px',
        md: '32px',
        lg: '40px',
        xl: '44px',
        xxl: '48px',
        xxxl: '64px',
        section: '80px',
        band: '160px',
        nav: '92px',
      },
      maxWidth: {
        content: '1083px',
      },
      height: {
        nav: '92px',
        touch: '44px',
      },
    },
  },
}
