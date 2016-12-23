const ansi = require('../../lib/ansi')
const telc = require('../../lib/telchars')

const FocusElement = require('../../lib/ui/form/FocusElement')

module.exports = class WorldMap extends FocusElement {
  // The world map - a grid of tiles that each represent an area you can go
  // to.

  constructor() {
    super()

    this.tiles = [
      // {x: 0, y: 0},
      // {x: 1, y: 0},
      // {x: 2, y: 0},
      // {x: 0, y: 1},
      // {x: 1, y: 1},
      // {x: 2, y: 1, texture: [
      //   '~~~~~~~~~~',
      //   '~+------+~',
      //   '~|~.!!.~|~',
      //   '~|~.!!.~|~',
      //   '~+------+~',
      //   '~~~~~~~~~~'
      // ]},
      // {x: 0, y: 2},
      // {x: 1, y: 2},
      // {x: 2, y: 2}
    ]

    this.cursorX = null
    this.cursorY = null

    this.tileWidth = 10
    this.tileHeight = 6

    this.scrollX = 0
    this.scrollY = 0

    this.scrollTargetX = 0
    this.scrollTargetY = 0

    this.cursorStyle = 'nav'
  }

  drawTo(writable) {
    super.drawTo(writable)

    const tw = this.tileWidth
    const th = this.tileHeight

    const selected = this.selectedTile

    for (let tile of this.tiles) {
      if (tile === selected) {
        if (this.cursorStyle === 'nav') {
          writable.write(ansi.invert())
        }
      }

      if (this.cursorStyle === 'pick' && tile === selected) {
        writable.write(ansi.setAttributes([
          ansi.C_CYAN, ansi.A_INVERT]))
      } else if (tile.textureAttributes) {
        writable.write(ansi.setAttributes(tile.textureAttributes))
      }

      for (let texLine = 0; texLine < th; texLine++) {
        const line = (
          this.absTop + (tile.y * th) + texLine - Math.round(this.scrollY)
        )

        if (line < this.absTop || line > this.absBottom) continue

        for (let texCol = 0; texCol < tw; texCol++) {
          const col = (
            this.absLeft + (tile.x * tw) + texCol +
            Math.round(this.scrollX)
          )

          if (col < this.absLeft || col > this.absRight) continue

          writable.write(ansi.moveCursor(line, col))
          writable.write(tile.texture[texLine][texCol])
        }
      }

      if (tile.textureAttributes) {
        writable.write(ansi.setAttributes([ansi.A_RESET]))
      }

      if (tile === selected) {
        writable.write(ansi.resetAttributes())
      }
    }

    this.scrollX += (this.scrollTargetX - this.scrollX) / 3
    this.scrollY += (this.scrollTargetY - this.scrollY) / 3
  }

  keyPressed(keyBuf) {
    if (keyBuf[0] === 0x1b) {
      if (keyBuf[2] === 0x44) {
        this.scrollTargetX += this.tileWidth
      } else if (keyBuf[2] === 0x43) {
        this.scrollTargetX -= this.tileWidth
      } else if (keyBuf[2] === 0x41) {
        this.scrollTargetY -= this.tileHeight
      } else if (keyBuf[2] === 0x42) {
        this.scrollTargetY += this.tileHeight
      }
    } else if (telc.isSelect(keyBuf)) {
      this.emit('tileselected', this.selectedTile)
    }
  }

  get selectedTile() {
    // The tile under the center of the display.

    const stx = this.scrollTargetX
    const sty = this.scrollTargetY

    const x = Math.floor((this.w / 2 - stx) / this.tileWidth)
    const y = Math.floor((this.h / 2 + sty) / this.tileHeight)

    const tiles = this.tiles.filter(t => t.x === x && t.y === y)

    if (tiles.length) {
      return tiles[tiles.length - 1]
    } else {
      return null
    }
  }

  setTileAt(x, y, tile) {
    // Places the given tile at the given position. Replaces whatever tile is
    // already there, if there is one.

    const oldTile = this.getTileAt(x, y)

    if (oldTile) {
      this.tiles.splice(this.tiles.indexOf(oldTile), 1)
    }

    tile.x = x
    tile.y = y

    this.tiles.push(tile)
  }

  getTileAt(x, y) {
    // Gets the tile at the given position. Returns null if there is none.

    const tile = this.tiles.filter(t => t.x === x && t.y === y)[0]

    return tile ? tile : null
  }
}
