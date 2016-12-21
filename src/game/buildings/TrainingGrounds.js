const ansi = require('../../lib/ansi')

const MoneyBuilding = require('./MoneyBuilding')

module.exports = class TrainingGrounds extends MoneyBuilding {
  // Training grounds, a field to train soldiers in. NB -- doesn't actually
  // train soldiers!

  constructor() {
    super('Training Grounds')

    this.textureAttributes = [ansi.C_YELLOW]
    this.texture = [
      '..........',
      '.-~-~-~-~.',
      '.~~~~~~~~.',
      '.~~~~~~~~.',
      '.~-~-~-~-.',
      '..........'
    ]

    this.moneyPerSecond = 5 / 3
    this.moneyCap = 14000
  }
}
