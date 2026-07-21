import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-on-topic': 'var(--color-text-on-topic)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        silver: 'var(--color-silver)',
        'light-grey': 'var(--color-light-grey)',
        'dark-grey': 'var(--color-dark-grey)',
        'topic-ai': 'var(--color-topic-ai)',
        'topic-crypto': 'var(--color-topic-crypto)',
        cta: 'var(--color-cta)',
        'cta-hover': 'var(--color-cta-hover)',
        score: 'var(--color-score)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        locked: 'var(--color-locked)',
        'payment-primary': 'var(--color-payment-primary)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
// Trigger rebuild
