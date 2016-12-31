const Knight = require('./Knight')

module.exports = class User {
  // The basic user class.

  constructor(game) {
    this.game = game
    this.username = null
    this.kingdomBuildingDocs = []
    this.kingdomBuildings = []
    this.gold = 0

    this.knights = []

    this.items = {}
  }

  getItem(itemCls) {
    this.items[itemCls.title] = (this.items[itemCls.title] || 0) + 1
  }

  dbUpdate(doc) {
    this.game.dbUpdate(this.game.userDB, {username: this.username}, doc)
  }

  saveAll() {
    this.saveGold()
    this.saveBuildings()
    this.saveItems()
  }

  saveGold() {
    // Saves the amount of gold the user has in the user database.

    this.dbUpdate({
      $set: {
        gold: this.gold
      }
    })
  }

  saveBuildings() {
    // Saves the buildings the player has placed in the kingdom.

    this.dbUpdate({
      $set: {
        kingdomBuildings: this.kingdomBuildings.map(b => b.save())
      }
    })
  }

  saveItems() {
    // Saves the player's items.

    this.dbUpdate({
      $set: {
        items: this.items
      }
    })
  }

  load(doc) {
    this.username = doc.username || 'Unnamed'
    this.kingdomBuildingDocs = doc.kingdomBuildings || []
    this.gold = doc.gold || 0
    this.items = doc.items || {}

    this.knights = (doc.knights || []).map(knightDoc => {
      const knight = new Knight()
      knight.load(knightDoc)
      return knight
    })
  }

  static fromDocument(doc, game) {
    const user = new User(game)
    user.load(doc)
    return user
  }
}
