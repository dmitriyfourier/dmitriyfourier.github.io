module.exports = {
  theme: {
    colors: {
      // ...
      'tg': {
        light: '#fff',
        dark: '#15202b',
        deepdark: '#234',
      },
      'mk': {
        background: '#2e2e2e',
        comments: '#797979',
        white: '#d6d6d6',
        yellow: {
                  main: 'rgb(229,181,103)',
                  deco: 'rgb(229,181,103, 0.25)',
                },
        green: '#b4d273',
        orange: {
                  main: 'rgb(232,125,62)',
                  deco: 'rgb(232,125,62, 0.25)',
                },
        purple: {
                  main: 'rgb(158,134,200)',
                  deco: 'rgb(158,134,200, 0.25)',
                },
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


