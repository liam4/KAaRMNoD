const ConfirmDialog = require('../../../lib/ui/form/ConfirmDialog')

module.exports = class BuyDialog extends ConfirmDialog {
  constructor(building) {
    super(`Buy ${building.title} for ${building.price} gold?`)

    this.building = building

    this.confirmBtn.text = 'Buy'
    this.confirmBtn.fixLayout()
  }
}
