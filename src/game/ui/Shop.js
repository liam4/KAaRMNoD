const telc = require('../../lib/telchars')
const buildingClasses = require('../buildings/buildingClasses')

const FocusElement = require('../../lib/ui/form/FocusElement')

const Form     = require('../../lib/ui/form/Form')
const ShopItem = require('./ShopItem')

module.exports = class Shop extends FocusElement {
  constructor() {
    super()

    this.cursorX = null
    this.cursorY = null

    this.items = []

    this.form = new Form()
    this.addChild(this.form)

    this.buildShopItems()
  }

  fixLayout() {
    this.form.w = this.contentW
    this.form.h = this.contentH

    let nextY = 0
    for (let item of this.items) {
      item.x = 0
      item.y = nextY
      item.w = this.form.contentW
      item.h = 3
      nextY += item.h
    }
  }

  buildShopItems() {
    for (let buildingCls of buildingClasses) {
      const item = new ShopItem(buildingCls)
      this.form.addInput(item)
      this.items.push(item)

      item.on('selected', () => this.itemSelected(item))
    }
  }

  focus() {
    this.root.select(this.form)
  }

  keyPressed(keyBuf) {
    if (telc.isCancel(keyBuf)) {
      this.emit('cancelled')
      return
    }

    super.keyPressed(keyBuf)
  }

  itemSelected(item) {
    this.emit('itemselected', item)
  }
}
