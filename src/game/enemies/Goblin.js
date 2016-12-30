const Enemy = require('./Enemy')

const EarthShard = require('../items/EarthShard')

module.exports = class Goblin extends Enemy {
  static get title() { return 'Goblin' }
  static get maxHealth() { return 12 }
  static get attack() { return 30 }

  static get drops() {
    return {
      gold: 12,
      items: [
        {cls: EarthShard, chance: 50/100, count: 2}
      ]
    }
  }
}
