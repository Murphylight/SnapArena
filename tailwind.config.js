/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
    textColor: true,
    backgroundColor: true,
    borderColor: true,
    gradientColorStops: true,
  },
  safelist: [
    {
      pattern: /bg-(amber|orange|gray)-(500|600|700|800|900)/,
    },
    {
      pattern: /from-(amber|orange)-(500|600)/,
    },
    {
      pattern: /to-(amber|orange)-(500|600)/,
    },
    {
      pattern: /text-(amber|orange|gray)-(500|600|700|800|900)/,
    },
  ],
}; 