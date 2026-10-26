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
- **Automatic deploys.** A merge into `main` publishes the site on Cloudflare.

To write a post, run one command, then fill in the Markdown file it creates:

```sh
bash create "Как я перестал бояться дедлайнов"
# Created new post at src/posts/2026/10/Как-я-перестал-бояться-дедлайнов.md
```

---

## Contents

- [Getting started](#getting-started)
- [Writing posts](#writing-posts)
- [Project structure](#project-structure)
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

`bash create "Title"` creates `src/posts/YYYY/MM/Title.md` with this front matter. On Windows, run it in Git Bash.

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
| `published`     | `false` hides the post from the `/posts` feed; its page still builds |

Put images in `src/assets/img/`. Plain `<img>` tags work. These shortcodes add captions and layout:

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
  posts/          blog posts, one folder per year and month
  podcasts/       podcast pages
  _includes/      page layouts
  _partials/      shared header, footer, theme toggle, fonts
  _data/          site settings (site.json) and the build version
  assets/         images, fonts, styles and scripts copied as is
tailwind.css      Tailwind entry: theme colors, dark mode, base styles
.eleventy.js      Eleventy config: plugins, shortcodes, image pipeline
create            script that creates a new post
```

## Code style

Prettier formats templates and styles and sorts Tailwind classes:

```sh
npm run format
```

Post content and JavaScript are not formatted. JavaScript follows the ESLint config.

## Deployment

A merge into `main` starts a [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) deploy of `_site/`.

- **Image cache.** Turn on build caching for the project in Cloudflare. Workers Builds then keeps `.cache/eleventy-img/` between builds, and unchanged images aren't re-encoded.
- **Asset URLs.** Stylesheet and script URLs get a `?v=` value that changes on every build. Browsers keep `/assets` for up to four hours, so without it returning visitors would see new pages with old styles.

---

The repository keeps its old GitHub Pages name, `dmitriyfourier.github.io`, but the site now runs on Cloudflare.
