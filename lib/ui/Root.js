const ansi = require('../ansi')
const DisplayElement = require('./DisplayElement')

module.exports = class Root extends DisplayElement {
  // An element to be used as the root of a UI.

  constructor() {
    super()

    this.selected = null
  }

  drawTo(writable) {
    writable.write(ansi.moveCursor(0, 0))
    writable.write(' '.repeat(this.w * this.h))

    super.drawTo(writable)

    if (this.selected) {
      writable.write(
        ansi.moveCursor(this.selected.absCursorY, this.selected.absCursorX))
    } else {
      writable.write(ansi.moveCursor(0, 0))
    }
  }
}
