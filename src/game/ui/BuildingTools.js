const telc = require('../../lib/telchars')

const Form = require('../../lib/ui/form/Form')

const HorizontalBox = require('../../lib/ui/HorizontalBox')
const Button =        require('../../lib/ui/form/Button')
const MoneyBuilding = require('../buildings/MoneyBuilding')

module.exports = class BuildingTools extends Form {
  constructor() {
    super()

    this.building = null

    this.horizontalBox = new HorizontalBox()
    this.addChild(this.horizontalBox)

    this.useBtn = new Button('Use')
    this.addInput(this.useBtn, false)
    this.horizontalBox.addChild(this.useBtn)

    this.cancelBtn = new Button('Cancel')
    this.addInput(this.cancelBtn, false)
    this.horizontalBox.addChild(this.cancelBtn)

    this.upgradeBtn = new Button('Upgrade')
    this.addInput(this.upgradeBtn, false)
    this.horizontalBox.addChild(this.upgradeBtn)

    this.moveBtn = new Button('Move')
    this.addInput(this.moveBtn, false)
    this.horizontalBox.addChild(this.moveBtn)

    this.sellBtn = new Button('Sell')
    this.addInput(this.sellBtn, false)
    this.horizontalBox.addChild(this.sellBtn)

    this.initEventListeners()
  }

  initEventListeners() {
    this.useBtn.on('pressed', () => this.usePressed())
    this.cancelBtn.on('pressed', () => this.cancelPressed())
    this.sellBtn.on('pressed', () => this.sellPressed())
  }

  loadBuilding(building) {
    this.building = building

    if (building instanceof MoneyBuilding) {
      this.useBtn.text = `Collect (${building.moneyValueText})`
    } else {
      this.useBtn.text = 'Use'
    }

    this.fixLayout()
  }

  keyPressed(keyBuf) {
    if (telc.isCancel(keyBuf)) {
      this.emit('cancelled')
      return
    }

    super.keyPressed(keyBuf)
  }

  usePressed() {
    this.emit('usepressed')
  }

  cancelPressed() {
    this.emit('cancelled')
  }

  sellPressed() {
    this.emit('sellpressed')
  }

  focus() {
    this.root.select(this.useBtn)
    this.curIndex = 0
  }
}
