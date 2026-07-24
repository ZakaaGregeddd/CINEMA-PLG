module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0f12',
        surface: '#161920',
        'surface-hover': '#1f242e',
        'surface-border': '#2a2f3d',
        primary: '#f0bd8b',
        'primary-hover': '#e3ab76',
        'primary-container': '#382618',
        secondary: '#665e45',
        accent: '#e65100',
        'text-main': '#f3f4f6',
        'text-muted': '#9ca3af',
        'xxi-gold': '#d4af37',
        'cgv-red': '#e50914',
        'cinepolis-blue': '#00529b',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
