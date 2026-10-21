/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,html}",
    "./src/templates/**/*.html"
  ],
  safelist: [
    'active',
    'show',
    'hide-ui',
    'mobile-menu-open',
    'show-ui-on-hover'
  ],
  theme: {
    extend: {
      colors: {
        bgUi: 'var(--color-surface)',
        borderUi: 'var(--color-border)',
        text: 'var(--color-text)',
      },
      screens: {
        'xs': '360px',
        'sm': '481px',
        'md': '769px',
        'lg': '1200px',
      },
      backdropBlur: {
        'xs': '2px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      }
    },
  },
  plugins: [],
};
