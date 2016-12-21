const Building = require('./Building')

module.exports = class MoneyBuilding extends Building {
  // A building whose only job is to make money over time.

  constructor(type) {
    super(type)

    this.lastCollectTime = Date.now()

    // The rate at which money is gotten - this value per second.
    this.moneyPerSecond = 1

    // The maximum amount of money this building can store at any single
    // time.
    this.moneyCap = 150
  }

  load(doc) {
    super.load(doc)

    this.lastCollectTime = (doc.building.lastCollectTime || Date.now())
  }

  save() {
    const s = super.save()

    Object.assign(s.building, {
      lastCollectTime: this.lastCollectTime
    })

    return s
  }

  collectMoney() {
    const val = this.currentMoneyValue

    this.lastCollectTime = Date.now()

    return val
  }

  get currentMoneyValue() {
    return Math.min(this.moneyCap, Math.round(
      // Money gained since we last collected.
      (Date.now() - this.lastCollectTime) / 1000 * this.moneyPerSecond
    ))
  }

  get moneyValueText() {
    const val = this.currentMoneyValue
    return val + (val < this.moneyCap ? '+' : '') + 'G'
  }
}
