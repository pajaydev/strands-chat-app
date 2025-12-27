import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        'surface-hover': '#1a1a1a',
        border: '#1f1f1f',
        foreground: '#ededed',
        muted: '#a1a1a1',
        accent: '#3b82f6',
        'accent-hover': '#2563eb',
        warning: '#f59e0b',
        'warning-bg': '#1a1410',
        error: '#fca5a5',
        'error-bg': '#1a0f0f',
        'error-border': '#3f1f1f',
      },
    },
  },
  plugins: [],
};

export default config;
