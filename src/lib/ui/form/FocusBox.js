const ansi = require('../../ansi')

const FocusElement = require('./FocusElement')

module.exports = class FocusBox extends FocusElement {
  // A box that can be selected. When it's selected, it applies an invert
  // effect to its children.

  constructor() {
    super()

    this.cursorX = null
    this.cursorY = null
  }

  drawTo(writable) {
    if (this.isSelected) {
      writable.write(ansi.invert())
    }
  }

  didRenderTo(writable) {
    if (this.isSelected) {
      writable.write(ansi.resetAttributes())
    }
  }
}
