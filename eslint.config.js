// ESLint looks for mistakes; formatting is left to Prettier.
// Code that runs in browsers is also checked against package.json
// "browserslist" with eslint-plugin-compat.
const js = require("@eslint/js");
const globals = require("globals");
const compat = require("eslint-plugin-compat");

const BROWSER_FILES = ["src/assets/scripts/**/*.js", "src/worker.js"];

module.exports = [
  { ignores: ["_site/", ".cache/", "src/assets/scripts/*.min.js"] },
  js.configs.recommended,
  {
    // Build config and Node scripts
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  { ...compat.configs["flat/recommended"], files: BROWSER_FILES },
  {
    // Site scripts, loaded with plain <script> tags
    files: ["src/assets/scripts/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: { ...globals.browser, jQuery: "readonly" },
    },
    rules: {
      // localStorage can throw (private mode, blocked storage); such errors
      // are ignored on purpose with an empty catch
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-unused-vars": ["error", { caughtErrors: "none" }],
    },
  },
  {
    // Cloudflare Worker
    files: ["src/worker.js"],
    languageOptions: { sourceType: "script", globals: globals.serviceworker },
  },
];
