// Lowers the CSS that Tailwind builds to the browsers in package.json
// "browserslist". Tailwind targets Chrome 111, Safari 16.4 and Firefox 128;
// this adds vendor prefixes and HEX fallbacks for its oklch colors, so older
// browsers still get the theme. Usage: node scripts/compat-css.js <file.css>
const fs = require("fs");
const browserslist = require("browserslist");
const { transform, browserslistToTargets } = require("lightningcss");

const file = process.argv[2];
const { code, warnings } = transform({
  filename: file,
  code: fs.readFileSync(file),
  minify: true,
  targets: browserslistToTargets(browserslist()),
});
warnings.forEach((warning) => console.warn(`[compat-css] ${warning.message}`));
fs.writeFileSync(file, code);
