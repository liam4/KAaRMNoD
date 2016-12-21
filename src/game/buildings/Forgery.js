const ansi = require('../../lib/ansi')

const Building = require('./Building')

module.exports = class Forgery extends Building {
  constructor() {
    super('Forgery')

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
}
