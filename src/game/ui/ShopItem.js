const ansi = require('../../lib/ansi')
const telc = require('../../lib/telchars')

const FocusBox = require('../../lib/ui/form/FocusBox')

const Pane     = require('../../lib/ui/Pane')
const Label    = require('../../lib/ui/Label')

module.exports = class ShopItem extends FocusBox {
  constructor(buildingClass) {
    super()

    this.buildingClass = buildingClass

    this.pane = new Pane()
    this.addChild(this.pane)

    this.titleLabel = new Label(buildingClass.title)
    this.pane.addChild(this.titleLabel)

    this.priceLabel = new Label(buildingClass.price + 'G')
    this.pane.addChild(this.priceLabel)
  }

  drawTo(writable) {
    if (this.isSelected) {
      this.priceLabel.textAttributes = []
    } else {
      this.priceLabel.textAttributes = [ansi.C_YELLOW]
    }

    super.drawTo(writable)
  }

  fixLayout() {
    this.pane.w = this.contentW
    this.pane.h = this.contentH

    this.titleLabel.x = 0
    this.titleLabel.y = 0

    this.priceLabel.x = this.pane.contentW - this.priceLabel.w
    this.priceLabel.y = 0
  }

  keyPressed(keyBuf) {
    if (telc.isSelect(keyBuf)) {
      this.emit('selected')
      return
    }
  }
}
