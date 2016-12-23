const ConfirmDialog = require('../../../lib/ui/form/ConfirmDialog')

module.exports = class SellDialog extends ConfirmDialog {
  constructor(building) {
    super(`Sell ${building.title} for ${building.sellValue} gold?`)

    this.building = building

    this.confirmBtn.text = 'Sell'
    this.confirmBtn.fixLayout()
  }
}
