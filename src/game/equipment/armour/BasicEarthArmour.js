const Armour = require('./Armour')

const Equippable = require('../Equippable')

module.exports = class BasicEarthArmour extends Armour {
  static get title() { return 'Basic Earth Armour' }

  static get element() { return Equippable.ELEMENT_EARTH }

  static get statBoosts() {
    return {
      attack: 14,
      defence: 27
    }
  }
}
