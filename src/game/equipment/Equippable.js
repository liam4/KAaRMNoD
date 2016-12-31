class Equippable {
  static get title() { return 'Untitled Equippable' }

  static get statBoots() {
    // The various stats that this armour boosts.

    return {}
  }
}

Equippable.ELEMENT_WATER  = 'water'
Equippable.ELEMENT_EARTH  = 'earth'
Equippable.ELEMENT_FIRE   = 'fire'
Equippable.ELEMENT_AIR    = 'air'
Equippable.ELEMENT_MYSTIC = 'mystic'

module.exports = Equippable
