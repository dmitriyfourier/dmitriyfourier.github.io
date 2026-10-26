const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const moment = require("moment");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const {
  default: Image,
  eleventyImageTransformPlugin,
} = require("@11ty/eleventy-img");
const embedEverything = require("eleventy-plugin-embed-everything");
const pluginRss = require("@11ty/eleventy-plugin-rss").default;
const getSimilarCategories = function (categoriesA, categoriesB) {
  return categoriesA.filter(Set.prototype.has, new Set(categoriesB)).length;
};
moment.locale("ru");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(embedEverything);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addFilter("dateIso", (date) => {
    return moment(date).toISOString();
  });

  eleventyConfig.addFilter("dateReadable", (date) => {
    return moment(date).utc().format("LL"); // E.g. May 31, 2019
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // To enable merging of tags
  eleventyConfig.setDataDeepMerge(true);

  // Copy these static files to _site folder
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/avatar");
  eleventyConfig.addPassthroughCopy("src/CV");
  eleventyConfig.addPassthroughCopy("src/i");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // rss settings
  eleventyConfig.addPlugin(pluginRss);

  // To create excerpts
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_alias: "post_excerpt",
    excerpt_separator: "<!-- excerpt -->",
  });

  //related pages
  eleventyConfig.addCollection("sortedPosts", function (collectionApi) {
    return collectionApi
      .getFilteredByTag("posts")
      .sort((a, b) => b.date - a.date);
  });
  eleventyConfig.addLiquidFilter(
    "similarPosts",
    function (collection, path, categories) {
      if (!categories) return []; // Возвращаем пустой массив, если категории не определены
      return collection
        .filter((post) => {
          return (
            post.data.categories && // Проверяем, что у поста есть категории
            getSimilarCategories(post.data.categories, categories) >= 1 &&
            post.data.page.inputPath !== path
          );
        })
        .sort((a, b) => {
          return (
            getSimilarCategories(b.data.categories, categories) -
            getSimilarCategories(a.data.categories, categories)
          );
        });
    }
  );

  // To create a filter to determine duration of post
  eleventyConfig.addFilter("readTime", (value) => {
    const content = value;
    const textOnly = content.replace(/(<([^>]+)>)/gi, "");
    const readingSpeedPerMin = 450;
    return Math.max(1, Math.floor(textOnly.length / readingSpeedPerMin));
  });

  // Enable us to iterate over all the tags, excluding posts and all
  eleventyConfig.addCollection("tagList", (collection) => {
    const tagsSet = new Set();
    collection.getAll().forEach((item) => {
      if (!item.data.tags) return;
      item.data.tags
        .filter((tag) => !["posts", "all"].includes(tag))
        .forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  });
  // slugify filter //
  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    return slugify(str, {
      lower: true,
      replacement: "-",
      strict: true,
      locale: "en",
      remove: /["]/g,
    });
  });

  const md = markdownIt({ html: true, linkify: true });
  /*md.use(markdownItAnchor, { 
    level: [1, 2], 
    permalink: markdownItAnchor.permalink.headerLink({ 
      safariReaderFix: true,
      class: 'header-anchor',
    })
  })*/

  // MD Table Container //

  eleventyConfig.setLibrary("md", md);
  // Open graph generation
  eleventyConfig.addFilter("splitlines", function (input) {
    const parts = input.split(" ");
    const lines = parts.reduce(function (prev, current) {
      if (!prev.length) {
        return [current];
      }

      let lastOne = prev[prev.length - 1];

      if (lastOne.length + current.length > 19) {
        return [...prev, current];
      }

      prev[prev.length - 1] = lastOne + " " + current;

      return prev;
    }, []);

    return lines;
  });
  // Conver og images from SVG to JPG
  eleventyConfig.on("afterBuild", () => {
    const socialPreviewImagesDir = "_site/assets/img/og/";
    fs.readdir(socialPreviewImagesDir, function (err, files) {
      if (files.length > 0) {
        files.forEach(function (filename) {
          if (filename.endsWith(".svg")) {
            let imageUrl = socialPreviewImagesDir + filename;
            Image(imageUrl, {
              formats: ["jpeg"],
              outputDir: "./" + socialPreviewImagesDir,
              filenameFormat: function (id, src, width, format, options) {
                let outputFilename = filename.substring(0, filename.length - 4);

                return `${outputFilename}.${format}`;
              },
            });
          }
        });
      }
    });
  });
  // aside notes
  eleventyConfig.addLiquidShortcode("aside", (text) => {
    return `<p class="aside">${text}</p>`;
  });

  // shortcod note-image
  eleventyConfig.addLiquidShortcode("aside-img", (filename, alt, caption) => {
    return `<figure class="aside"><img src="/assets/img/${filename}" alt="${alt}" /><figcaption>${caption}</figcaption></figure>`;
  });

  // telgram hortcode embeded
  eleventyConfig.addLiquidShortcode("tg-embed", (tgchannel, tgpost) => {
    return `<div class="tg-embeded"> <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-post="${tgchannel}/${tgpost}" data-width="100%" data-userpic="true" data-color="CA9C0E" data-dark="1" data-dark-color="F0B138"></script></div>`;
  });
  // IMAGES
  // asset_img shortcode
  eleventyConfig.addLiquidShortcode("asset_img", (filename, alt, caption) => {
    return `<figure><img src="/assets/img/${filename}" alt="${alt}" /><figcaption>${caption}</figcaption></figure>`;
  });

  // Replace <img> in the HTML output with responsive <picture>
  const imageWidths = [];
  for (let width = 400; width < 1920; width += 150) {
    imageWidths.push(width);
  }
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // Output folder and URL prefix for optimized images.
    outputDir: "_site/assets/img/",
    urlPath: "/assets/img/",
    formats: ["avif", "webp", "jpeg"],
    widths: imageWidths,
    filenameFormat: (id, src, width, format) =>
      `${path.parse(src).name}-${id}-${width}w.${format}`,
    defaultAttributes: {
      // `auto` lets lazy images use their real layout width; the fallback
      // is the content width (body margins are 2vw + 10px on each side).
      sizes: "auto, calc(96vw - 40px)",
      loading: "lazy",
      decoding: "async",
    },
  });

  // Load the first post image eagerly when it is likely on the first screen
  eleventyConfig.addFilter("eagerFirstImage", (html) => {
    const match = /<img\b/.exec(html);
    if (!match) {
      return html;
    }
    const textBefore = html
      .slice(0, match.index)
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (textBefore.length > 600) {
      return html;
    }
    return (
      html.slice(0, match.index) +
      '<img loading="eager" fetchpriority="high" sizes="calc(96vw - 40px)"' +
      html.slice(match.index + 4)
    );
  });

  // Content embedded in listings should not compete for the first screen
  eleventyConfig.addFilter("lazyImages", (html) =>
    typeof html === "string"
      ? html.replace(/ loading="eager"| fetchpriority="high"/g, "")
      : html
  );

  return {
    dir: {
      input: "src",
    },
  };
};
