const Dungeon = require('./Dungeon')

module.exports = class RelicRuins extends Dungeon {
  static get title() { return (
    'Relic Ruins'
  )}

  static get description() {return (
    'The large remnants of an old temple, Relic Ruins is now infested by' +
    ' countless monsters attracted to the treasures that lay in the rubble.'
  )}

  static get waves() {return [

  ]}
}
