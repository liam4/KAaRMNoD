const ansi = require('../../ansi')

const FocusElement = require('./FocusElement')

module.exports = class ButtonInput extends FocusElement {
  // A button.

  constructor(text) {
    super()

    this.text = text

    this.cursorX = null
    this.cursorY = null
  }

  // Setting the text of the button should change the width of the button to
  // fit the text.
  set text(newText) {
    this._text = newText
    this.w = newText.length
  }

  get text() {
    return this._text
  }

  drawTo(writable) {
    if (this.isSelected) {
      writable.write(ansi.invert())
    }

    writable.write(ansi.moveCursor(this.absTop, this.absLeft))
    writable.write(this.text)

    writable.write(ansi.resetAttributes())

    super.drawTo(writable)
  }

  handleKeyPressed(keyBuf) {
    if (keyBuf[0] === 0x20 || (keyBuf[0] === 0x0d && keyBuf[1] === 0x00)) {
      this.emit('pressed')
    }
  }
}
