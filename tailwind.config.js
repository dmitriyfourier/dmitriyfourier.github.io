module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.md', './src/**/*.html', './src/_includes/**/*.liquid', './node_modules/flowbite/**/*.js'],
  plugins: [
    require('@tailwindcss/typography'),
    require('flowbite/plugin')
  ],
}


