// Eleventy configuration: https://www.11ty.dev/docs/config/
// Templates live in src/, the built site goes to _site/.
// Styles are built separately by the Tailwind CLI from tailwind.css.

const fs = require("fs");
const path = require("path");
const markdownIt = require("markdown-it");
const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const embedEverything = require("eleventy-plugin-embed-everything");
const TurndownService = require("turndown");
const { gfm } = require("turndown-plugin-gfm");
// These two packages are ESM-only, so require() returns their namespace
const pluginRss = require("@11ty/eleventy-plugin-rss").default;
const {
  default: Image,
  eleventyImageTransformPlugin,
} = require("@11ty/eleventy-img");

// Where optimized images live. .cache is kept between Cloudflare Workers
// Builds for Eleventy projects, so unchanged images aren't re-encoded.
const INPUT_DIR = "src";
const IMAGE_CACHE_DIR = ".cache/eleventy-img/";
const IMAGE_URL_PATH = "/assets/img/";
// Folders inside the build output (_site by default)
const IMAGE_OUTPUT_SUBDIR = "assets/img";
// Social preview SVGs are rendered by src/og.liquid and converted to JPEG
const OG_IMAGES_SUBDIR = "assets/img/og";

// Content width: body margins are 2vw + 10px on each side
const CONTENT_SIZES = "calc(96vw - 40px)";
// Responsive widths for post images: 400, 550, … 1900px
const IMAGE_WIDTHS = Array.from({ length: 11 }, (_, i) => 400 + i * 150);

// Eleventy's built-in tags and our helper collections, not real post tags
const SERVICE_TAGS = new Set(["all", "posts"]);

// Characters per minute used for the reading time estimate
const READING_SPEED = 450;
// Max rules Cloudflare reads from _headers
const CLOUDFLARE_HEADER_RULES = 100;
// Max characters per line of a title on the social preview image
const OG_LINE_LENGTH = 19;

// "31 мая 2019 г." — dates are stored in UTC, so format them in UTC too
const readableDate = new Intl.DateTimeFormat("ru", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// Posts can live in their own folder together with their files:
// src/posts/YYYY/MM/my-post/my-post.md next to photo.jpg, report.pdf, …
// Returns that folder, or null for a post that shares its folder.
const postFolder = (inputPath) => {
  const dir = path.dirname(inputPath);
  return path.basename(dir) === path.parse(inputPath).name ? dir : null;
};

// Files in a post folder that Eleventy builds itself rather than copies
const POST_TEMPLATE_FILES = /\.(md|liquid|html|njk|json|11tydata\.js)$/i;

// A file referenced relatively from a post in its own folder, or null
const postFile = (page, ref) => {
  if (!page?.inputPath || !ref || /^([a-z][a-z\d+.-]*:|\/|#)/i.test(ref)) {
    return null;
  }
  const dir = postFolder(page.inputPath);
  const file = dir && path.join(dir, decodeURI(ref));
  return file && fs.existsSync(file) ? file : null;
};

// "/posts/2024/06/my-post/photo.jpg": the path eleventy-img resolves from
// the input folder. Unlike a relative path, it also works when the post is
// shown inside another page (feed, tag pages).
const inputUrl = (file) =>
  `/${path.relative(INPUT_DIR, file).split(path.sep).join("/")}`;

// <figure> with an optional caption, used by the image shortcodes. The file
// comes from the post's folder if it is there, otherwise from src/assets/img/
const figure = (page, filename, alt = "", caption, className) =>
  `<figure${className ? ` class="${className}"` : ""}>` +
  `<img src="${
    postFile(page, filename)
      ? inputUrl(postFile(page, filename))
      : `${IMAGE_URL_PATH}${filename}`
  }" alt="${alt}" />` +
  (caption ? `<figcaption>${caption}</figcaption>` : "") +
  "</figure>";

// HTML → Markdown for the .md versions of pages (src/markdown.liquid).
// Links and images get absolute URLs, so the Markdown works wherever it is
// pasted. Scripts, embeds, decorative images (alt="") and duplicates hidden
// from screen readers (aria-hidden) are dropped.
const { url: SITE_URL } = require("./src/_data/site.json");
const absoluteUrl = (href) => {
  if (href.startsWith("#") || !URL.canParse(href, SITE_URL)) {
    return href;
  }
  const url = new URL(href, SITE_URL);
  if (url.origin === SITE_URL) {
    url.pathname = url.pathname.replace(/\/{2,}/g, "/");
  }
  return url.href;
};
const turndown = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndown.use(gfm);
// Rules added with addRule take priority over the built-in ones, and the
// last one added is checked first, so "drop" goes at the end
turndown.addRule("image", {
  filter: "img",
  replacement: (content, node) =>
    `![${node.getAttribute("alt")}](${absoluteUrl(node.getAttribute("src"))})`,
});
// Block content inside a link (cards) collapses to one line
turndown.addRule("link", {
  filter: (node) => node.nodeName === "A" && node.getAttribute("href"),
  replacement: (content, node) => {
    const text = content.replace(/\s+/g, " ").trim();
    return text ? `[${text}](${absoluteUrl(node.getAttribute("href"))})` : "";
  },
});
// "- item" instead of turndown's "-   item"
turndown.addRule("listItem", {
  filter: "li",
  replacement: (content, node) => {
    const parent = node.parentNode;
    const prefix =
      parent.nodeName === "OL"
        ? `${
            (Number(parent.getAttribute("start")) || 1) +
            Array.from(parent.childNodes)
              .filter((child) => child.nodeName === "LI")
              .indexOf(node)
          }. `
        : "- ";
    const body = content
      .replace(/^\n+|\n+$/g, "")
      .replace(/\n/g, `\n${" ".repeat(prefix.length)}`);
    return prefix + body + (node.nextSibling ? "\n" : "");
  },
});
turndown.addRule("drop", {
  filter: (node) =>
    ["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "BUTTON"].includes(
      node.nodeName
    ) ||
    node.getAttribute("aria-hidden") === "true" ||
    (node.nodeName === "IMG" && !node.getAttribute("alt")),
  replacement: () => "",
});

module.exports = function (eleventyConfig) {
  // ---------------------------------------------------------------------------
  // Plugins
  // ---------------------------------------------------------------------------

  // YouTube, Instagram and other links on their own line become embeds
  eleventyConfig.addPlugin(embedEverything);
  // Prism highlighting for fenced code blocks
  eleventyConfig.addPlugin(syntaxHighlight);
  // RSS/Atom filters used by src/feed.njk
  eleventyConfig.addPlugin(pluginRss);

  // Allow raw HTML in Markdown and turn bare URLs into links.
  // ![alt](photo.jpg) in a post with its own folder takes the image from
  // that folder (Eleventy passes the page data to markdown-it as env).
  const md = markdownIt({ html: true, linkify: true });
  const renderImage = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const file = postFile(env.page, tokens[idx].attrGet("src"));
    if (file) {
      tokens[idx].attrSet("src", inputUrl(file));
    }
    return renderImage(tokens, idx, options, env, self);
  };
  // [report](report.pdf) points to the copy next to the page (see
  // "Files from post folders" below); the full path keeps the link
  // working in the feed and on tag pages too
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet("href");
    if (postFile(env.page, href)) {
      tokens[idx].attrSet("href", `${env.page.url}${href}`);
    }
    return self.renderToken(tokens, idx, options);
  };
  eleventyConfig.setLibrary("md", md);

  // ---------------------------------------------------------------------------
  // Static files copied to _site as is
  // ---------------------------------------------------------------------------

  [
    "src/assets",
    "src/CV",
    "src/manifest.json",
    "src/browserconfig.xml",
    "src/robots.txt",
    "src/CNAME",
  ].forEach((file) => eleventyConfig.addPassthroughCopy(file));

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------

  // Posts from newest to oldest, the source for similar posts
  eleventyConfig.addCollection("sortedPosts", (collectionApi) =>
    collectionApi.getFilteredByTag("posts").sort((a, b) => b.date - a.date)
  );

  // Every tag used on the site, sorted, for the /tags page
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set(
      collectionApi.getAll().flatMap((item) => item.data.tags || [])
    );
    return [...tags].filter((tag) => !SERVICE_TAGS.has(tag)).sort();
  });

  // Pages that also get a Markdown version: front matter `markdown: true`
  eleventyConfig.addCollection("markdownPages", (collectionApi) => {
    const pages = collectionApi.getAll().filter((item) => item.data.markdown);
    // src/headers.liquid writes two _headers rules per page; Cloudflare
    // ignores rules past 100
    if (pages.length * 2 > CLOUDFLARE_HEADER_RULES) {
      console.warn(
        `[markdown] ${pages.length} pages need ${pages.length * 2} _headers rules, Cloudflare applies only ${CLOUDFLARE_HEADER_RULES}`
      );
    }
    return pages;
  });

  // ---------------------------------------------------------------------------
  // Filters
  // ---------------------------------------------------------------------------

  // Machine-readable date for <time datetime> and feeds
  eleventyConfig.addFilter("dateIso", (date) => new Date(date).toISOString());

  // Human-readable Russian date
  eleventyConfig.addFilter("dateReadable", (date) =>
    readableDate.format(new Date(date))
  );

  // Reading time in minutes, at least 1
  eleventyConfig.addFilter("readTime", (html) => {
    const text = html.replace(/<[^>]+>/g, "");
    return Math.max(1, Math.floor(text.length / READING_SPEED));
  });

  // URL-safe slug for tags; Cyrillic is transliterated
  eleventyConfig.addFilter("slug", (str) =>
    str ? slugify(str, { lower: true, strict: true, locale: "en" }) : undefined
  );

  // Posts sharing categories with the current one, most shared first.
  // Usage: collections.sortedPosts | similarPosts: page.inputPath, categories
  eleventyConfig.addLiquidFilter(
    "similarPosts",
    (posts, inputPath, categories) => {
      if (!categories) {
        return [];
      }
      const wanted = new Set(categories);
      return posts
        .filter((post) => post.inputPath !== inputPath && post.data.categories)
        .map((post) => ({
          post,
          shared: post.data.categories.filter((c) => wanted.has(c)).length,
        }))
        .filter(({ shared }) => shared > 0)
        .sort((a, b) => b.shared - a.shared)
        .map(({ post }) => post);
    }
  );

  // URL of a page's Markdown version: /posts/x/ → /posts/x.md, / → /index.md
  eleventyConfig.addFilter("markdownUrl", (url) =>
    url === "/" ? "/index.md" : `${url.replace(/\/$/, "")}.md`
  );

  // Social preview image from `cover:` — a file in the post's folder
  // (served next to the page) or one in src/assets/covers/
  eleventyConfig.addFilter("coverUrl", function (cover) {
    return postFile(this.page, cover)
      ? `${this.page.url}${cover}`
      : `/assets/covers/${cover}`;
  });

  // Images from a post's folder are rendered with their source path for
  // eleventy-img. Outside the image pipeline (Markdown versions, RSS) point
  // them to the originals served next to the page instead.
  // Usage: post.content | postFileUrls: post
  const postFileUrls = (html, item) => {
    const dir = item && postFolder(item.inputPath);
    return dir ? html.replaceAll(`"${inputUrl(dir)}/`, `"${item.url}`) : html;
  };
  eleventyConfig.addFilter("postFileUrls", postFileUrls);

  // Rendered page content as Markdown. Usage: item.content | toMarkdown: item
  eleventyConfig.addFilter("toMarkdown", (html, item) =>
    turndown.turndown(postFileUrls(html, item))
  );

  // Splits a title into lines that fit the social preview image
  eleventyConfig.addFilter("splitlines", (input) =>
    input.split(" ").reduce((lines, word) => {
      const last = lines[lines.length - 1];
      if (last !== undefined && last.length + word.length <= OG_LINE_LENGTH) {
        lines[lines.length - 1] = `${last} ${word}`;
      } else {
        lines.push(word);
      }
      return lines;
    }, [])
  );

  // ---------------------------------------------------------------------------
  // Shortcodes for posts
  // ---------------------------------------------------------------------------

  // Current year, for the footer copyright
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // {% asset_img 'file.jpg' 'alt' 'caption' %} — image from the post's
  // folder or from src/assets/img/
  eleventyConfig.addLiquidShortcode(
    "asset_img",
    function (filename, alt, caption) {
      return figure(this.page, filename, alt, caption);
    }
  );

  // {% aside 'text' %} — side note, floats right on wide screens
  eleventyConfig.addLiquidShortcode(
    "aside",
    (text) => `<p class="aside">${text}</p>`
  );

  // {% aside-img 'file.jpg' 'alt' 'caption' %} — side image with a caption
  eleventyConfig.addLiquidShortcode(
    "aside-img",
    function (filename, alt, caption) {
      return figure(this.page, filename, alt, caption, "aside");
    }
  );

  // {% tg-embed 'channel' 'postId' %} — Telegram post widget
  eleventyConfig.addLiquidShortcode(
    "tg-embed",
    (channel, post) =>
      `<div class="tg-embeded"><script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-post="${channel}/${post}" data-width="100%" data-userpic="true" data-color="CA9C0E" data-dark="1" data-dark-color="F0B138"></script></div>`
  );

  // ---------------------------------------------------------------------------
  // Images
  // ---------------------------------------------------------------------------

  // Every <img> in the output becomes a <picture> with AVIF/WebP/JPEG sources.
  // Per-image overrides go in attributes: sizes, loading, eleventy:widths.
  // File names contain a hash of the source and options, so a changed image
  // gets a new name. Names are recorded to publish only the ones in use.
  const usedImages = new Set();
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    outputDir: IMAGE_CACHE_DIR,
    urlPath: IMAGE_URL_PATH,
    formats: ["avif", "webp", "jpeg"],
    widths: IMAGE_WIDTHS,
    filenameFormat: (id, src, width, format) => {
      const filename = `${path.parse(src).name}-${id}-${width}w.${format}`;
      usedImages.add(filename);
      return filename;
    },
    defaultAttributes: {
      // `auto` lets lazy images use their real layout width
      sizes: `auto, ${CONTENT_SIZES}`,
      loading: "lazy",
      decoding: "async",
    },
  });

  // After a production build, copy the images this build uses from the cache
  // into _site and delete the rest from the cache so it doesn't grow forever.
  // `eleventy --serve` generates images on request instead.
  eleventyConfig.on("eleventy.after", ({ runMode, directories }) => {
    if (runMode !== "build" || usedImages.size === 0) {
      return;
    }
    const outputDir = path.join(directories.output, IMAGE_OUTPUT_SUBDIR);
    fs.mkdirSync(outputDir, { recursive: true });
    for (const filename of fs.readdirSync(IMAGE_CACHE_DIR)) {
      const cached = path.join(IMAGE_CACHE_DIR, filename);
      if (usedImages.has(filename)) {
        fs.copyFileSync(cached, path.join(outputDir, filename));
      } else {
        fs.unlinkSync(cached);
      }
    }
    usedImages.clear();
  });

  // Files from post folders: everything next to a post that isn't a
  // template or data file is copied next to its page, so
  // src/posts/2024/06/my-post/report.pdf is served at /posts/my-post/report.pdf
  eleventyConfig.addWatchTarget(`${INPUT_DIR}/posts/`);
  eleventyConfig.on("eleventy.after", ({ directories, results }) => {
    for (const { inputPath, url } of results) {
      const dir = postFolder(inputPath);
      if (!dir || !url) {
        continue;
      }
      for (const name of fs.readdirSync(dir)) {
        if (name.startsWith(".") || POST_TEMPLATE_FILES.test(name)) {
          continue;
        }
        fs.cpSync(
          path.join(dir, name),
          path.join(directories.output, url, name),
          { recursive: true }
        );
      }
    }
  });

  // Convert the social preview SVGs into JPEGs next to them
  eleventyConfig.on("eleventy.after", async ({ directories }) => {
    const ogDir = path.join(directories.output, OG_IMAGES_SUBDIR);
    if (!fs.existsSync(ogDir)) {
      return;
    }
    const svgs = fs
      .readdirSync(ogDir)
      .filter((file) => file.endsWith(".svg"));
    await Promise.all(
      svgs.map((file) =>
        Image(path.join(ogDir, file), {
          formats: ["jpeg"],
          outputDir: ogDir,
          filenameFormat: (id, src, width, format) =>
            `${path.basename(file, ".svg")}.${format}`,
        })
      )
    );
  });

  // Post page: load the first image eagerly if it's likely on the first
  // screen (at most ~600 characters of text above it).
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
      `<img loading="eager" fetchpriority="high" sizes="${CONTENT_SIZES}"` +
      html.slice(match.index + "<img".length)
    );
  });

  // Post lists: posts embedded in a list must not compete for the first screen
  eleventyConfig.addFilter("lazyImages", (html) =>
    typeof html === "string"
      ? html.replace(/\s+(?:loading="eager"|fetchpriority="high")/g, "")
      : html
  );

  return {
    dir: {
      input: INPUT_DIR,
    },
  };
};
