const Enemy = require('./Enemy')

module.exports = class Goldbag extends Enemy {
  static get title() { return 'Goldbag' }
  static get maxHealth() { return 7 }
  static get attack() { return 6 }

  static get drops() {
    return {
      gold: 1200
    }
  }
}
