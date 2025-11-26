import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0f172a',
        cyan: '#22d3ee',
        neon: '#84cc16',
        textPrimary: '#f8fafc',
        textSecondary: '#cbd5e1',
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(34, 211, 238, 0.35)',
      },
    },
  },
  plugins: [],
}

export default config