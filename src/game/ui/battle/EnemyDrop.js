const Sprite = require('../../../lib/ui/Sprite')

module.exports = class EnemyDrop extends Sprite {
  // A dropped item from an enemy - it's a Sprite, so you can add it as a
  // child to other various elements.

  constructor() {
    super()

    this.xv = 3 * (Math.random() - 0.5)
    this.yv = -2 * Math.random()

    // The sprite should have some kind of horizontal propulsion..
    if (this.xv > 0) {
      this.xv = Math.max(this.xv, 0.3)
    } else {
      this.xv = Math.min(this.xv, -0.3)
    }

    this.groundTicks = 0
  }

  drawTo(writable) {
    this.realX += this.xv
    this.realY += this.yv
    this.xv *= 0.9
    this.yv += 0.5

    // TODO: This shouldn't really be a constant, to detect if it's on the
    // "ground"
    if (this.y >= 9) {
      this.xv = 0
      this.yv = 0
      this.groundTicks += 1

      if (this.groundTicks > 5) {
        this.emit('removerequested')

        // Emitting the 'removerequested' event will cause this drop to be
        // removed from its parent - immediately. Because it's removed right
        // away, the Sprite's drawTo method won't work (since it needs access
        // to the parent), so we don't run the drawTo method at all.
        return
      }
    }

    super.drawTo(writable)
  }
}
