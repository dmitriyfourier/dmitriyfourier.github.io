module.exports = {
  
  colors: {
    'tg-dark': '#15202b',
    'tg-light' '#fff',

  },
  darkMode: 'class',
  content: ['./src/**/*.md', './src/**/*.html', './src/_includes/**/*.liquid', './node_modules/flowbite/**/*.js'],
  plugins: [
    require('@tailwindcss/typography'),
    require('flowbite/plugin')
  ],
}


