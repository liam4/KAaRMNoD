module.exports = class Building {
  // The class used to represent a kingdom building. This can be used as a
  // tile in WorldMap.

  constructor() {
    this.x = null
    this.y = null
    this.textureAttributes = []
    this.texture = [
      '??????????',
      '??????????',
      '??????????',
      '??????????',
      '??????????',
      '??????????'
    ]
  }

  // Static properties
  static get title() { return 'Building' }
  static get price() { return 0 }
  get title() { return this.constructor.title }
  get price() { return this.constructor.price }

  get sellValue() {
    // The amount of gold that would be gotten from selling this building.
    // Equivalent to half of its purchase price, floored.

    if (this.price === 0) {
      return 0
    }

    return Math.floor(this.price / 2)
  }

  load(doc) {
    this.x = doc.x
    this.y = doc.y
  }

  save() {
    // Add more to this in subclasses - ideally extend the save().building
    // object.

    return {
      title: this.title,
      x: this.x,
      y: this.y,
      building: {}
    }
  }
}
