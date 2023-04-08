module.exports = {
  theme: {
    colors: {
      // ...
      'tg': {
        light: '#fff',
        dark: '#15202b',
      },
      'mk': {
        background: '#2e2e2e',
        comments: '#797979',
        white: '#d6d6d6',
        yellow: '#e5b567',
        green: '#b4d273',
        orange: '#e87d3e',
        purple: '#9e86c8',
        pink: '#b05279',
        blue: '#6c99bb',
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


