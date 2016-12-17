module.exports = class Flushable {
  // A writable that can be used to collect chunks of data before writing
  // them.

  constructor(writable) {
    this.target = writable

    this.chunks = []
  }

  write(what) {
    this.chunks.push(what)
  }

  flush() {
    this.target.write(this.chunks.join(''))

    this.chunks = []
  }
}
