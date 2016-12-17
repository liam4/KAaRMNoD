const ansi = require('../ansi')

const DisplayObject = require('./DisplayObject')

module.exports = class Label extends DisplayObject {
  // A simple text display.

  constructor(text) {
    super()

    this.text = text

    this.textColor = null
  }

  drawTo(writable) {
    writable.write(ansi.setForeground(this.textColor))
    writable.write(ansi.moveCursor(this.top, this.left))
    writable.write(this.text)

    super.drawTo(writable)
  }
}
