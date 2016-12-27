const Sprite = require('../../lib/ui/Sprite')

module.exports = class Character {
  constructor(initStats) {
    if (initStats) {
      this.initStats()
    } else {
      this.health = 0
    }

    this.sprite = new Sprite()
  }

  initStats() {
    this.health = this.maxHealth
  }

  static get title() { return 'Unnamed Character' }
  static get maxHealth() { return 150 }
  static get attack() { return 750 }
  get title() { return this.constructor.title }
  get maxHealth() { return this.constructor.maxHealth }
  get attack() { return this.constructor.attack }
}
