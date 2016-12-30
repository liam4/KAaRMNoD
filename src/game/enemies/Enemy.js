const Character = require('./Character')

module.exports = class Enemy extends Character {
  static get title() { return 'Unnamed Enemy' }

  static get drops() {
    return {
      gold: 0,
      items: []
    }
  }

  get drops() { return this.constructor.drops }

  generateDropItems() {
    // Generates a set of items that could be dropped by this enemy. Relies
    // on various logic rules you can customize; doesn't deal with gold.

    const items = this.drops.items

    // If there aren't any items that could possibly be dropped then we
    // certainly won't have any items dropped!
    if (!items || items.length === 0) {
      return []
    }

    const generatedItems = []

    for (let rule of items) {
      const {
        cls,
        chance = 100/100,
        count = 1
      } = rule

      // TODO: {from, to} should be possible here
      const realCount = count

      if (Math.random() <= chance) {
        for (let i = 0; i < realCount; i++) {
          generatedItems.push(cls)
        }
      }
    }

    return generatedItems
  }
}
