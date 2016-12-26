const ansi = require('../ansi')

const DisplayElement = require('./DisplayElement')

module.exports = class Sprite extends DisplayElement {
  // "A sprite is a two-dimensional bitmap that is integrated into a larger
  // scene." - Wikipedia
  //
  // Sprites are display objects that have a single texture that will not
  // render outside of their parent.

  constructor() {
    super()

    this.texture = []
  }

  drawTo(writable) {
    for (let y = 0; y < this.textureHeight; y++) {
      // Don't render above or below the parent's content area.
      if (this.y + y >= this.parent.contentH || this.y + y < 0) continue

      const right = this.x + this.textureWidth

      const start = (this.x < 0) ? -this.x : 0
      const end = (
        (right > this.parent.contentW)
        ? this.parent.contentW - right
        : right)
      const text = this.texture[y].slice(start, end)

      writable.write(ansi.moveCursor(this.absY + y, this.absX + start))
      writable.write(text)
    }
  }

  fixLayout() {
    this.w = this.textureWidth
    this.h = this.textureHeight
  }

  get textureWidth() {
    return Math.max(...this.texture.map(row => row.length))
  }

  get textureHeight() {
    return this.texture.length
  }
}
