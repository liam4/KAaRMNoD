const ansi = require('../ansi')
const DisplayElement = require('./DisplayElement')
const FocusElement = require('./form/FocusElement')

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

    this.socket.write(ansi.hideCursor())

    // Cheats and resizes the (x)terminal. Please be nice and don't steal
    // this code and spam it at someone with varying values :) Also it
    // doesn't work in fullscreen Terminal.app, so..
    this.socket.write('\x1b[8;24;80t')
  }

  handleData(buffer) {
    if (buffer[0] === 255) {
      // Telnet IAC (Is A Command) - ignore
      return
    }

    if (this.selected) {
      const els = this.selected.directAncestors.concat([this.selected])
      for (let el of els) {
        if (el instanceof FocusElement) {
          const shouldBreak = (el.keyPressed(buffer) === false)
          if (shouldBreak) {
            break
          }
        }
      }
    }
  }

  drawTo(writable) {
    writable.write(ansi.moveCursor(0, 0))
    writable.write(' '.repeat(this.w * this.h))
  }

  didRenderTo(writable) {
    // Render the cursor, based on the cursorX and cursorY of the currently
    // selected element.
    if (
      this.selected &&
      typeof this.selected.cursorX === 'number' &&
      typeof this.selected.cursorY === 'number' &&
      (Date.now() - this.cursorBlinkOffset) % 1000 < 500
    ) {
      writable.write(ansi.moveCursor(
        this.selected.absCursorY, this.selected.absCursorX))
      writable.write(ansi.invert())
      writable.write('I')
      writable.write(ansi.resetAttributes())
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

    this.selected = el
    this.selected.focus()

    this.cursorMoved()
  }
}
