const Form = require('../../lib/ui/form/Form')

const HorizontalBox = require('../../lib/ui/HorizontalBox')
const Button =        require('../../lib/ui/form/Button')

module.exports = class BuildingTools extends Form {
  constructor() {
    super()

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
    this.cancelBtn.on('pressed', () => this.cancelPressed())
  }

  cancelPressed() {
    this.emit('cancelled')
  }

  focus() {
    this.root.select(this.useBtn)
  }
}
