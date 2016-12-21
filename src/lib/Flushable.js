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

    this.chunks = []
  }

  write(what) {
    this.chunks.push(what)
  }

  flush() {
    let toWrite = this.chunks.join('')

    if (this.shouldCompress) {
      toWrite = this.compress(toWrite)
    }

    this.target.write(toWrite)

    this.chunks = []
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
