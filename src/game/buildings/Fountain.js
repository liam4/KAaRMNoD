const ansi = require('../../lib/ansi')

const MoneyBuilding = require('./MoneyBuilding')

module.exports = class Fountain extends MoneyBuilding {
  // The fountain, a simple slow money-making pool that gathers donations
  // from (imaginary) visitors. Free to build.

  constructor() {
    super('Fountain')

    this.textureAttributes = [ansi.C_BLUE]
    this.texture = [
      '..........',
      '.┌──────┐.',
      '.│-*-*-*│.',
      '.│*-*-*-│.',
      '.└──────┘.',
      '..........'
    ]

    this.moneyPerSecond = 5 / 6
    this.moneyCap = 600
  }
}
