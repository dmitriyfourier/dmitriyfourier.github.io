# fourier.rocks

The source of [fourier.rocks](https://fourier.rocks), Dmitriy Fourier's personal site: a Russian-language blog, podcast pages and a CV. It is a plain static site built with Eleventy. There is no front-end framework: pages are HTML styled with Tailwind, and posts are Markdown files you can write in any editor.

- **Light pages.** The home page is about 320 KB in total. The site's own scripts are two files of about 1 KB each: the theme toggle and keyboard navigation. jQuery and the Fotorama gallery load only on posts that have a gallery.
- **Responsive images.** Every `<img>` becomes a `<picture>` with AVIF, WebP and JPEG in widths from 400 to 1900 px. You don't need to prepare images by hand.
- **Light and dark themes.** The site follows the system theme until the visitor picks one. Colors come from the [Harmony](https://github.com/evilmartians/harmony) palette, and there is a high-contrast variant.
- **Accessible.** The site has:
  - a skip link and labelled menus;
  - names for every button;
  - touch targets of at least 24 px;
  - Ctrl + arrow shortcuts between posts.
- **Ready for sharing.** Posts get tags, related posts, reading time, an RSS feed, a sitemap, and an Open Graph preview image generated from the title.
- **Readable by AI tools.** Every post, podcast and the home page also has a clean Markdown version at the same URL with `.md`, for example `/posts/knowledges-types.md`. Pages link to it with `<link rel="alternate">` and an HTTP `Link` header. [`/llms.txt`](https://fourier.rocks/llms.txt) lists all of them, and `robots.txt` allows AI use through `Content-Signal`.
- **Automatic deploys.** A merge into `main` publishes the site on Cloudflare.

To write a post, run one command, then fill in the Markdown file it creates. Its images and files go in the same folder:

```sh
bash create "Как я перестал бояться дедлайнов" deadlines
# Created new post at src/posts/2026/10/deadlines/deadlines.md
# Put its images and files in src/posts/2026/10/deadlines/ and the post will be at /posts/deadlines/
```

---

## Contents

- [Getting started](#getting-started)
- [Writing posts](#writing-posts)
- [Project structure](#project-structure)
- [Supported browsers](#supported-browsers)
- [Code style](#code-style)
- [Deployment](#deployment)

## Getting started

You need **Node.js 22 or newer** (`.node-version` pins 24) and git.

1. Clone the repository and install dependencies:

   ```sh
   git clone https://github.com/dmitriyfourier/dmitriyfourier.github.io.git
   cd dmitriyfourier.github.io
   npm install
   ```

2. Start the dev server:

   ```sh
   npm start
   ```

   This runs Eleventy and the Tailwind watcher together. The site is at <http://localhost:8080> and reloads when you save a file.

3. Build the production site into `_site/`:

   ```sh
   npm run build
   ```

> **The first build is slow.** It encodes every image into three formats and many widths. The results are cached in `.cache/eleventy-img/`, so later builds only encode new or changed images.

## Writing posts

Every post has its own folder: `src/posts/YYYY/MM/<slug>/<slug>.md`. The page is published at `/posts/<slug>/`, so the year and month only sort the sources. The folder and the file must have the same name; otherwise the post's files aren't picked up.

`bash create "Title" [slug]` creates the folder and the file with this front matter. Without a slug, it is made from the title, with Cyrillic transliterated. On Windows, run it in Git Bash.

```markdown
---
title: "Как я перестал бояться дедлайнов"
date: "2026-10-26"
tags:
  -
---

<!-- excerpt -->
```

| Front matter    | What it does                                                         |
| --------------- | -------------------------------------------------------------------- |
| `title`, `date` | Title and publication date                                           |
| `tags`          | Tag pages at `/tags/…`; Cyrillic tags are transliterated in the URL  |
| `categories`    | A list; posts that share categories are shown as related posts       |
| `desc`          | Page description for search engines and link previews                |
| `cover`         | Link preview image: a file in the post's folder                      |
| `published`     | `false` hides the post from the `/posts` feed; its page still builds |

### Images and files

Put a post's images and attachments in its folder and refer to them by file name:

```markdown
![Схема квартала](plan.jpg)
[Презентация в PDF](slides.pdf)
{% asset_img 'plan.jpg' 'Схема квартала' 'Подпись' %}
```

- Images become responsive `<picture>` elements; the original is also served at `/posts/<slug>/plan.jpg`.
- Every other file in the folder is copied next to the page, so `slides.pdf` opens at `/posts/<slug>/slides.pdf`.
- Images shared by several posts stay in `src/assets/img/`; shortcodes look there when the post's folder has no such file.

> **Raw HTML isn't rewritten.** An `<img>` or `<a>` written as HTML needs an absolute path, such as `/assets/img/file.jpg`. Use Markdown or a shortcode for files in the post's folder.

These shortcodes add captions and layout:

| Shortcode                                    | Result                                  |
| -------------------------------------------- | --------------------------------------- |
| `{% asset_img 'file.jpg' 'alt' 'caption' %}` | Image with a caption                    |
| `{% aside 'text' %}`                         | Side note, floats right on wide screens |
| `{% aside-img 'file.jpg' 'alt' 'caption' %}` | Small side image with a caption         |
| `{% tg-embed 'channel' 'postId' %}`          | Telegram post widget                    |

A YouTube, Instagram or similar link on its own line becomes an embed.

## Project structure

```
src/
  posts/          blog posts: YYYY/MM/<slug>/<slug>.md with the post's images and files
  podcasts/       podcast pages
  _includes/      page layouts
  _partials/      shared header, footer, theme toggle, fonts, meta tags and JSON-LD
  _icons/         SVG icons inlined with {% icon 'name' %} in the header and footer
  _data/          site settings (site.json) and the build version
  markdown.liquid .md versions of pages with `markdown: true` (all posts, podcasts, home)
  headers.liquid  _headers for Cloudflare: Link headers between pages and their .md
  llms.liquid     /llms.txt
  assets/         images, fonts, styles and scripts copied as is
tailwind.css      Tailwind entry: theme colors, dark mode, base styles
.eleventy.js      Eleventy config: plugins, shortcodes, image pipeline
create            script that creates a new post
scripts/          compat-css.js: lowers the built CSS to the browsers in package.json
eslint.config.js  ESLint rules, with browser compatibility checks
```

## Supported browsers

Chrome and Edge 109+, Safari 15.4+ and Firefox 115 ESR+, listed in `browserslist` in `package.json`. That is about 95% of visitors worldwide. Older browsers don't support the cascade layers that Tailwind relies on.

The same list drives two tools:

- **CSS.** `npm run build` passes the built stylesheet through `scripts/compat-css.js`. It adds vendor prefixes and HEX fallbacks for Tailwind's `oklch()` colors, so Chrome 109 still gets the theme. The dev server serves the stylesheet without this step.
- **JavaScript.** `eslint-plugin-compat` fails the lint when a site script uses a browser API that a supported browser lacks.

To check what a change to the list covers, paste it into [browsersl.ist](https://browsersl.ist) or run:

```sh
npx browserslist --coverage=global,RU
```

## Code style

Prettier formats templates and styles and sorts Tailwind classes:

```sh
npm run format
```

Post content and JavaScript are not formatted. ESLint checks JavaScript for mistakes and checks the site scripts against the supported browsers:

```sh
npm run lint
```

## Deployment

A merge into `main` starts a [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) deploy of `_site/`.

- **Image cache.** Turn on build caching for the project in Cloudflare. Workers Builds then keeps `.cache/eleventy-img/` between builds, and unchanged images aren't re-encoded.
- **Asset URLs.** Stylesheet and script URLs get a `?v=` value that changes on every build. Browsers keep `/assets` for up to four hours, so without it returning visitors would see new pages with old styles.

---

The repository keeps its old GitHub Pages name, `dmitriyfourier.github.io`, but the site now runs on Cloudflare.
