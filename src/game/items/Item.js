module.exports = class Item {
  // An item. Dropped by monsters; found in chests; etc.

  static get title() { return 'Untitled Item' }

  get title() { return this.constructor.title }
}
