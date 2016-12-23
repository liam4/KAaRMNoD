const ansi = require('../../lib/ansi')

const MoneyBuilding = require('./MoneyBuilding')

module.exports = class TrainingGrounds extends MoneyBuilding {
  // Training grounds, a field to train soldiers in. NB -- doesn't actually
  // train soldiers!

  static get title() { return 'Training Grounds' }
  static get price() { return 15000 }
  static get moneyCap() { return 14000 }
  static get moneyPerSecond() { return 5 / 3 }

  constructor() {
    super()

    this.textureAttributes = [ansi.C_YELLOW]
    this.texture = [
      '..........',
      '.-~-~-~-~.',
      '.~~~~~~~~.',
      '.~~~~~~~~.',
      '.~-~-~-~-.',
      '..........'
    ]
  }
}
