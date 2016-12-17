const ansi = require('../ansi')
const unic = require('../unichars')

const DisplayObject = require('./DisplayObject')

module.exports = class Pane extends DisplayObject {
  // A simple rectangular framed pane.

  constructor() {
    super()
    this.hPadding = 1
    this.vPadding = 1
  }

  drawTo(writable) {
    this.drawFrame(writable)
    super.drawTo(writable)
  }

  drawFrame(writable, debug=false) {
    for (let x = this.left + 1; x <= this.right - 1; x++) {
      writable.write(ansi.moveCursor(this.top, x))
      writable.write(unic.BOX_H)
      writable.write(ansi.moveCursor(this.bottom, x))
      writable.write(unic.BOX_H)
    }

    for (let y = this.top + 1; y <= this.bottom - 1; y++) {
      writable.write(ansi.moveCursor(y, this.left))
      writable.write(unic.BOX_V)
      writable.write(ansi.moveCursor(y, this.right))
      writable.write(unic.BOX_V)
    }

    // Corners
    writable.write(ansi.moveCursor(this.top, this.left))
    writable.write(unic.BOX_CORNER_TL)
    writable.write(ansi.moveCursor(this.top, this.right))
    writable.write(unic.BOX_CORNER_TR)
    writable.write(ansi.moveCursor(this.bottom, this.left))
    writable.write(unic.BOX_CORNER_BL)
    writable.write(ansi.moveCursor(this.bottom, this.right))
    writable.write(unic.BOX_CORNER_BR)

    // Debug info
    if (debug) {
      writable.write(ansi.moveCursor(6, 8))
      writable.write(
        `x: ${this.x}; y: ${this.y}; w: ${this.w}; h: ${this.h}`)
      writable.write(ansi.moveCursor(7, 8))
      writable.write(`AbsX: ${this.absX}; AbsY: ${this.absY}`)
      writable.write(ansi.moveCursor(8, 8))
      writable.write(`Left: ${this.left}; Right: ${this.right}`)
      writable.write(ansi.moveCursor(9, 8))
      writable.write(`Top: ${this.top}; Bottom: ${this.bottom}`)
    }
  }
}
