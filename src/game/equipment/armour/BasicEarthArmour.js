const Armour = require('./Armour')

const { EARTH } = require('../../Element')

module.exports = class BasicEarthArmour extends Armour {
  static get title() { return 'Basic Earth Armour' }

  static get element() { return EARTH }

  static get statBoosts() {
    return {
      attack: 14,
      defence: 27
    }
  }
}
