const Character = require('./Character')

module.exports = class Player extends Character {
  constructor(user) {
    super(false)

    this.user = user
    this.initStats()
  }

  static get title() { return 'Unnamed Player' }
  static get maxHealth() { return 90909 }
  static get attack() { return 90909 }

  get maxHealth() {
    return this.user.stats.maxHealth || this.constructor.maxHealth
  }

  get attack() {
    return this.user.stats.attack || this.constructor.attack
  }
}
