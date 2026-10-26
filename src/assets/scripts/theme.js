// Theme toggle. The initial theme is applied by _partials/theme-init.liquid
// in <head>; this script handles the button and later OS theme changes.
(function () {
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function savedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }

  function apply(dark) {
    root.classList.toggle("dark", dark);
    if (button) {
      button.setAttribute("aria-pressed", String(dark));
    }
  }

  apply(root.classList.contains("dark"));

  if (button) {
    button.addEventListener("click", function () {
      var dark = !root.classList.contains("dark");
      apply(dark);
      try {
        localStorage.setItem("theme", dark ? "dark" : "light");
      } catch (e) {}
    });
  }

  // Until the visitor picks a theme, follow the OS setting live
  systemDark.addEventListener("change", function (event) {
    if (!savedTheme()) {
      apply(event.matches);
    }
  });
})();
