const Character = require('./Character')

module.exports = class Player extends Character {
  constructor(knight) {
    super(false)

    this.knight = knight
    this.initStats()
  }

  static get title() { return 'Unnamed Player' }
  static get maxHealth() { return 90909 }
  static get attack() { return 90909 }

  get maxHealth() {
    return this.knight.stats.maxHealth || 0
  }

  get attack() {
    return this.knight.stats.attack || 0
  }
}
