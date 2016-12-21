module.exports = class User {
  // The basic user class.

  constructor(game) {
    this.game = game
    this.username = null
    this.kingdomBuildingDocs = []
    this.gold = 0
  }

  saveAll(obj) {
    const doc = this.asDBDocument(obj)

    // console.log('Save:', doc)

    this.game.dbUpdate(this.game.userDB,
      {username: this.username}, doc)
  }

  asDBDocument({kingdomBuildings = []} = {}) {
    // TODO: reimplement as 'save' as standardized in buildings

    // Converts the user into a database document. Can be used on its own or
    // via saveAll.

    return {
      username: this.username,
      kingdomBuildings: kingdomBuildings.map(b => b.save()),
      gold: this.gold
    }
  }

  static fromDBDocument(doc, game) {
    // TODO: reimplement as 'load' as standardized in buildings

    // Load from a database object/document.

    const user = new User(game)
    user.username = doc.username || 'Unnamed'
    user.kingdomBuildingDocs = doc.kingdomBuildings || []
    user.gold = doc.gold || 0
    return user
  }
}
