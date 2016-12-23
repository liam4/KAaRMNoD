const ansi = require('../../lib/ansi')

const MoneyBuilding = require('./MoneyBuilding')

module.exports = class Fountain extends MoneyBuilding {
  // The fountain, a simple slow money-making pool that gathers donations
  // from (imaginary) visitors. Free to build.

  static get title() { return 'Fountain' }
  static get price() { return 0 }
  static get moneyCap() { return 600 }
  static get moneyPerSecond() { return 5 / 6 }

  constructor() {
    super()

    this.textureAttributes = [ansi.C_BLUE]
    this.texture = [
      '..........',
      '.┌──────┐.',
      '.│-*-*-*│.',
      '.│*-*-*-│.',
      '.└──────┘.',
      '..........'
    ]
  }
}
