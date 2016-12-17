const ansi = require('../../ansi')
const unic = require('../../unichars')

const FocusElement = require('./FocusElement')

module.exports = class TextInput extends FocusElement {
  // An element that the user can type in.

  constructor() {
    super()

    this.value = ''
  }

  drawTo(writable) {
    let str

    // There should be room for the cursor so move the "right edge" left a
    // single character.
    if (this.value.length > this.w - 1) {
      str = unic.ELLIPSIS + this.value.slice(
        this.value.length - this.w + 2, this.value.length)
    } else {
      str = this.value
    }

    writable.write(ansi.moveCursor(this.absTop, this.absLeft))
    writable.write(str)

    this.cursorX = str.length

    super.drawTo(writable)
  }

  focus(socket) {
    super.focus(socket)

    return new Promise(resolve => {
      const buf = Buffer.from([
        255, 253, 34,  // IAC DO LINEMODE
        255, 250, 34, 1, 0, 255, 240,  // IAC SB LINEMODE MODE 0 IAC SE
        255, 251, 1    // IAC WILL ECHO
      ])

      socket.write(buf)

      const dataListener = data => {
        // IAC escape code - not user entered text.
        if (data[0] === 255) {
          return
        }

        // Delete/backspace - remove a character.
        else if (data[0] === 127) {
          this.value = this.value.slice(0, -1)
        }

        // Enter - unfocus, resolve promise.
        else if (data[0] === 13) {
          socket.removeListener('data', dataListener)
          resolve(this.value)
        }

        else {
          // console.log(data[0])
          this.value += data.toString()
        }
      }

      socket.on('data', dataListener)
    })
  }
}
