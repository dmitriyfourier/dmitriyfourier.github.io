// A new value on every build. Layouts append it to stylesheet and script
// URLs (?v=...), so after a deploy browsers fetch the new files instead of
// pairing new HTML with styles and scripts cached from the old one.
module.exports = {
  version: Date.now().toString(36),
}
