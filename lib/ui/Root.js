const ansi = require('../ansi')
const DisplayElement = require('./DisplayElement')

module.exports = class Root extends DisplayElement {
  // An element to be used as the root of a UI. Handles lots of UI and
  // socket stuff.

  constructor(socket) {
    super()

    this.socket = socket
    this.initTelnetOptions()

    this.selected = null

    this.cursorBlinkOffset = Date.now()

    socket.on('data', buf => this.handleData(buf))
  }

  initTelnetOptions() {
    // Initializes various socket options, using telnet magic.

    // Disables linemode.
    this.socket.write(Buffer.from([
      255, 253, 34,  // IAC DO LINEMODE
      255, 250, 34, 1, 0, 255, 240,  // IAC SB LINEMODE MODE 0 IAC SE
      255, 251, 1    // IAC WILL ECHO
    ]))
  }

  handleData(buffer) {
    if (buffer[0] === 255) {
      // Telnet IAC (Is A Command) - ignore
      return
    }

    if (this.selected) {
      this.selected.handleKeyPressed(buffer)
    }
  }

  drawTo(writable) {
    writable.write(ansi.moveCursor(0, 0))
    writable.write(' '.repeat(this.w * this.h))

    super.drawTo(writable)

    if (this.selected) {
      if ((Date.now() - this.cursorBlinkOffset) % 1000 < 500) {
        writable.write(ansi.moveCursor(
          this.selected.absCursorY, this.selected.absCursorX))
        writable.write(ansi.invert())
        writable.write('I')
        writable.write(ansi.resetAttributes())
      }
    }
    writable.write(ansi.moveCursor(0, 0))
  }

  cursorMoved() {
    // Resets the blinking animation for the cursor. Call this whenever you
    // move the cursor.

    this.cursorBlinkOffset = Date.now()
  }

  select(el) {
    // Select an element. Calls the unfocus method on the already-selected
    // element, if there is one.

    if (this.selected) {
      this.selected.unfocus()
    }

    this.cursorMoved()

    this.selected = el
  }
}
