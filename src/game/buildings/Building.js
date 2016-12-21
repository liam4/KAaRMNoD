module.exports = class Building {
  // The class used to represent a kingdom building. This can be used as a
  // tile in WorldMap.

  constructor(type) {
    this.type = type
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

  load(doc) {
    this.x = doc.x
    this.y = doc.y
  }

  save() {
    // Add more to this in subclasses - ideally extend the save().building
    // object.

    return {
      type: this.type,
      x: this.x,
      y: this.y,
      building: {}
    }
  }
}
