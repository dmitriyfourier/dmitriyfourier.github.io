const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt = require('markdown-it')
const moment = require('moment')
const slugify = require('slugify')
const img2picture = require('eleventy-plugin-img2picture')
moment.locale('ru')

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString()
  })
 
  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).utc().format('LL') // E.g. May 31, 2019
  })

  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`)
  
  // To enable merging of tags
  eleventyConfig.setDataDeepMerge(true)

  // Copy these static files to _site folder
  eleventyConfig.addPassthroughCopy('src/assets')
  eleventyConfig.addPassthroughCopy('src/manifest.json')
  eleventyConfig.addPassthroughCopy('src/avatar')
  eleventyConfig.addPassthroughCopy('src/CV')
  eleventyConfig.addPassthroughCopy('src/i')
  eleventyConfig.addPassthroughCopy('src/browserconfig.xml')
  eleventyConfig.addPassthroughCopy('src/CNAME')

  // To create excerpts
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_alias: 'post_excerpt',
    excerpt_separator: '<!-- excerpt -->'
  })

  // To create a filter to determine duration of post
  eleventyConfig.addFilter('readTime', (value) => {
    const content = value
    const textOnly = content.replace(/(<([^>]+)>)/gi, '')
    const readingSpeedPerMin = 450
    return Math.max(1, Math.floor(textOnly.length / readingSpeedPerMin))
  })

  // Enable us to iterate over all the tags, excluding posts and all
  eleventyConfig.addCollection('tagList', collection => {
    const tagsSet = new Set()
    collection.getAll().forEach(item => {
      if (!item.data.tags) return
      item.data.tags
        .filter(tag => !['posts', 'all'].includes(tag))
        .forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  })
  // slugify filter //
  eleventyConfig.addFilter('slug', (str) => {
    if (!str) {
      return
    }
  
    return slugify(str, {
      lower: true,
      replacement: '-', 
      strict: true,
      locale: 'en',
      remove: /["]/g,
    })
  })

  const md = markdownIt({ html: true, linkify: true })
  /* md.use(markdownItAnchor, { 
    level: [1, 2], 
    permalink: markdownItAnchor.permalink.headerLink({ 
      safariReaderFix: true,
      class: 'header-anchor',
    })
  })*/
  eleventyConfig.setLibrary('md', md)
  // IMAGES
  eleventyConfig.addPlugin(img2picture, {
    // Should be same as Eleventy input folder set using `dir.input`.
    eleventyInputDir: './src/',

    // Output folder for optimized images.
    imagesOutputDir: '_site/assets/img/',

    // URL prefix for images src URLS.
    // It should match with path suffix in `imagesOutputDir`.
    // Eg: imagesOutputDir with `_site/images` likely need urlPath as `/images/`
    urlPath: '/assets/img/',
    extensions: ['jpg', 'png', 'jpeg'],
    formats: ['avif', 'webp', 'jpeg'],
    minWidth: 400,
    maxWidth: 1280,
    sizes:'100vw',
  })

  // asset_img shortcode
  eleventyConfig.addLiquidShortcode('asset_img', (filename, alt) => {
    return `<img class="my-4" src="/assets/img/${filename}" alt="${alt}" />`
  })

  return {
    dir: {
      input: 'src'
    }
  }
}