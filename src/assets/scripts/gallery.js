// Fotorama makes its arrows and thumbnails focusable buttons but leaves them
// unnamed, so screen readers announce just "button". Name them once a
// gallery is built.
(function ($) {
  function label(gallery) {
    var $gallery = $(gallery);
    $gallery.find(".fotorama__arr--prev").attr("aria-label", "Предыдущее фото");
    $gallery.find(".fotorama__arr--next").attr("aria-label", "Следующее фото");
    var $frames = $gallery.find(".fotorama__nav__frame");
    $frames.each(function (index) {
      $(this).attr("aria-label", "Фото " + (index + 1) + " из " + $frames.length);
    });
  }

  $(document).on("fotorama:ready", ".fotorama", function () {
    label(this);
  });
})(jQuery);
