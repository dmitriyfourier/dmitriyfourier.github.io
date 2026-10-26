# fourier.rocks

The source of [fourier.rocks](https://fourier.rocks), Dmitriy Fourier's personal blog and podcast pages, built with Eleventy.

The site is in Russian. The repository keeps its old GitHub Pages name, `dmitriyfourier.github.io`, but the site is now deployed with Cloudflare Workers.

- [Eleventy 3](https://www.11ty.dev/) with Liquid templates, content in `src/`
- [Tailwind CSS 4](https://tailwindcss.com/) with Typography and Flowbite plugins, dark mode
- Responsive AVIF/WebP/JPEG images generated from every `<img>` by [eleventy-img](https://www.11ty.dev/docs/plugins/image/)
- Tags, RSS feed, sitemap, related posts, reading time, Open Graph previews

## Requirements

Node.js 22 or newer (`.node-version` pins 24).

## Usage

```sh
npm install
npm start
```

This starts Eleventy and the Tailwind watcher together; the site is at http://localhost:8080.

Build the production site into `_site/`:

```sh
npm run build
```

Format templates and styles with Prettier; it also sorts Tailwind classes. Post content and JavaScript are left alone (JavaScript follows ESLint):

```sh
npm run format
```

## Writing posts

Create a post in `src/posts/YYYY/MM/` from a title:

```sh
bash create "Title of the post"
```

- Posts are published by default (`src/posts/posts.json`); `published: false` in front matter hides a post from the `/posts` list, but its page is still built.
- Put images in `src/assets/img/` and insert them with `{% asset_img 'file.jpg' 'alt text' 'caption' %}`. Plain `<img>` tags work too; both are converted to responsive `<picture>` on build.

## Deployment

A merge into `main` triggers a Cloudflare Workers Builds deploy of `_site/`. Optimized images are written to `.cache/eleventy-img/`, which Workers Builds keeps between builds when build caching is enabled for the project, so unchanged images aren't re-encoded.
