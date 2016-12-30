const ansi = require('../../lib/ansi')

const Building = require('./Building')

module.exports = class Forgery extends Building {
  static get title() { return 'Forgery' }
  static get price() { return 750 }

  constructor() {
    super()

    this.textureAttributes = [ansi.C_YELLOW]
    this.texture = [
      '┌────────┐',
      '│||||||||│',
      '│||||||||│',
      '│||||||||│',
      '│||||||||│',
      '└────────┘'
    ]
  }

  use() {
    this.emit('forgeryrequested')
  }
}
