const telc = require('../../lib/telchars')

const FocusBox = require('../../lib/ui/form/FocusBox')

const Pane     = require('../../lib/ui/Pane')
const Label    = require('../../lib/ui/Label')

module.exports = class ShopItem extends FocusBox {
  constructor(title) {
    super()

    this.title = title

    this.pane = new Pane()
    this.addChild(this.pane)

    this.label = new Label(title)
    this.pane.addChild(this.label)
  }

  fixLayout() {
    this.pane.w = this.contentW
    this.pane.h = this.contentH
  }

  keyPressed(keyBuf) {
    if (telc.isSelect(keyBuf)) {
      this.emit('selected')
      return
    }
  }
}
