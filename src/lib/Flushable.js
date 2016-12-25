const ansi = require('./ansi')

module.exports = class Flushable {
  // A writable that can be used to collect chunks of data before writing
  // them.

  constructor(writable, shouldCompress = false) {
    this.target = writable

    // Use the magical ANSI self-made compression method that probably
    // doesn't *quite* work but should drastically decrease write size?
    this.shouldCompress = shouldCompress

    // Update these if you plan on using the ANSI compressor!
    this.screenLines = 24
    this.screenCols = 80

    this.ended = false

    this.chunks = []
  }

  write(what) {
    this.chunks.push(what)
  }

  flush() {
    // Don't write if we've ended.
    if (this.ended) {
      return
    }

    let toWrite = this.chunks.join('')

    if (this.shouldCompress) {
      toWrite = this.compress(toWrite)
    }

    this.target.write(toWrite, err => {
      if (err) {
        console.error('Flushable write error (ending):', err.message)
        this.end()
      }
    })

    this.chunks = []
  }

  end() {
    this.ended = true
  }

  compress(toWrite) {
    // TODO: customize screen size
    const screen = ansi.interpret(toWrite, this.screenLines, this.screenCols)

    /*
    const pcSaved = Math.round(100 - (100 / toWrite.length * screen.length))
    console.log(
      '\x1b[1A' +
      `${toWrite.length} - ${screen.length} ${pcSaved}% saved   `
    )
    */

    return screen
  }
}
