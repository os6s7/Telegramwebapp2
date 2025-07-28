module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nested',
    'tailwindcss': { config: './tailwind.config.ts' },
    'autoprefixer': {},
  }
}
