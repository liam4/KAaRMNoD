const Character = require('./Character')

module.exports = class Enemy extends Character {
  static get title() { return 'Unnamed Enemy' }
}
