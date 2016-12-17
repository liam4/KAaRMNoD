const ansi = require('../ansi')

const DisplayObject = require('./DisplayObject')

module.exports = class Text extends DisplayObject {
  // A simple text display.

  constructor(text) {
    super()

    this.text = text
  }

  drawTo(writable) {
    writable.write(ansi.moveCursor(this.top, this.left))
    writable.write(this.text)

    super.drawTo(writable)
  }
}
