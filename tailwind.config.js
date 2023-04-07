module.exports = {
  theme: {
    colors: {
      // ...
      'tg': {
        light: '#fff',
        dark: '#15202b',
      },
      // ...
    },
  },
  
  darkMode: 'class',
  content: ['./src/**/*.md', './src/**/*.html', './src/_includes/**/*.liquid', './node_modules/flowbite/**/*.js'],
  plugins: [
    require('@tailwindcss/typography'),
    require('flowbite/plugin')
  ],
}


