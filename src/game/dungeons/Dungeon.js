module.exports = class Dungeon {
  // An object that represents a dungeon.

  static get title() { return 'Gloomy World' }
  static get description() { return 'A boring abandoned dungeon.' }
  static get waves() { return [] }

  get title() { return this.constructor.title }
  get description() { return this.constructor.description }
  get waves() { return this.constructor.waves }
}
