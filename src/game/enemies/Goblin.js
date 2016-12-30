const Enemy = require('./Enemy')

module.exports = class Goblin extends Enemy {
  static get title() { return 'Goblin' }
  static get maxHealth() { return 12 }
  static get attack() { return 30 }
}
