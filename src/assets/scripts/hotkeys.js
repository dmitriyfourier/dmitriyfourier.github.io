// Ctrl + arrows follow the previous/next links: posts in a post page,
// feed pages in the blog and podcast feeds. The links announce the shortcut
// with aria-keyshortcuts; text fields keep Ctrl + arrows for themselves.
(function () {
  var targets = {
    ArrowLeft: "previousPost",
    ArrowRight: "nextPost",
    ArrowUp: "latestPosts",
    ArrowDown: "earlierPosts",
  };

  document.addEventListener("keydown", function (event) {
    if (!event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
      return;
    }
    if (event.defaultPrevented || event.target.closest("input, textarea, select, [contenteditable]")) {
      return;
    }
    var link = targets[event.key] && document.getElementById(targets[event.key]);
    if (link) {
      event.preventDefault();
      window.location.href = link.href;
    }
  });
})();
