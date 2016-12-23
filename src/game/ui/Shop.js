const telc = require('../../lib/telchars')
const buildingClasses = require('../buildings/buildingClasses')

const FocusElement = require('../../lib/ui/form/FocusElement')

const ListScrollForm = require('../../lib/ui/form/ListScrollForm')
const ShopItem =       require('./ShopItem')

module.exports = class Shop extends FocusElement {
  constructor() {
    super()

    this.cursorX = null
    this.cursorY = null

    this.items = []

    this.form = new ListScrollForm()
    this.addChild(this.form)

    this.buildShopItems()
  }

  fixLayout() {
    this.form.w = this.contentW
    this.form.h = this.contentH

    for (let item of this.items.slice(this.scrollItems)) {
      item.w = this.form.contentW
      item.h = 3
    }

    this.form.fixLayout()
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
