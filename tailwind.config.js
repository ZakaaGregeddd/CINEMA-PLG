module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#faf9f4',
        'on-background': '#1b1c19',
        primary: '#7d562d',
        'on-primary': '#ffffff',
        surface: '#faf9f4',
        'surface-dim': '#dbdad5',
        'surface-bright': '#faf9f4',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f4ef',
        'surface-container': '#efeee9',
        'surface-container-high': '#e9e8e3',
        'surface-container-highest': '#e3e3de',
        'on-surface': '#1b1c19',
        'on-surface-variant': '#50453b',
        outline: '#82756a',
        'outline-variant': '#d4c4b7',
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
