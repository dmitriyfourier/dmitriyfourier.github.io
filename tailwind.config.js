module.exports = {
  theme: {
    colors: {
      // ...
      'social': {
        facebook: '#1877f2',
        twitter: '#1da1f2',
        mastodon: '#6364FF',
        whatsapp: '#25d366',
        google: '#dd4b39',
        linkedin: '#0a66c2',
        reddit: '#ff4500',
        instagram:'#c13584',
        lastfm:'#d51007',
        odnoklassniki:'#ed812b',
        spotify:'#1db954',
        gitlab:'#fca326',
        dribbble:'#ea4c89',
        telegram:'#0088cc',
        goodreads:'#553b08',
        kaggle:'#20beff',
        blizzard:'#0e86ca',
        epicgames:'#121212',
        medium:'#1a8917',
        vk:'#45668e',
        xbox:'#52b043',
        twitch:'#9146ff',
        playstation:'#003087',
        bitcoin:'#f7901f',
        ethereum:'#464a76',
        youtube:'#ff0000',
        behance:'#0057FF',
        pinterest:'#e60023',
        imdb:'#f6c700',
        'github': {
          light:'#333',
          dark: '#f5f5f5',
        },
        'steam': {
          light:'#000000',
          dark: '#f5f5f5',
        },
      },
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
        greenlow: {
            main: 'rgb(122,168,116)',
            deco: 'rgb(122,168,116 0.25)',
                },
        pink: '#b05279',
        blue: {
                  main: '#6c99bb',
                  deco: 'rgb(108,153,187, 0.25)',
                  deep: '#4344b3',
                  deepde:'rgb(67, 68, 179, 0.25)'},
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


