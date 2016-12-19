const ansi = require('../ansi')

const DisplayElement = require('./DisplayElement')

module.exports = class Label extends DisplayElement {
  // A simple text display. Automatically adjusts size to fit text.

  constructor(text='') {
    super()

    this.text = text

    this.color = null
  }

  drawTo(writable) {
    writable.write(ansi.setForeground(this.color))
    writable.write(ansi.moveCursor(this.absTop, this.absLeft))
    writable.write(this.text)
    writable.write(ansi.setForeground(ansi.C_RESET))

    super.drawTo(writable)
  }

  set text(newText) {
    this._text = newText

    this.w = newText.length
  }

  get text() {
    return this._text
  }
}
