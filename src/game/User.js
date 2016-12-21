module.exports = class User {
  // The basic user class.

  constructor(game) {
    this.game = game
    this.username = null
    this.kingdomBuildings = []
  }

  saveAll() {
    const doc = this.asDBDocument()

    this.game.dbUpdate(this.game.userDB,
      {username: this.username}, doc)
  }

  asDBDocument() {
    // Converts the user into a database document. Can be used on its own or
    // via saveAll.

    return {
      username: this.username,
      kingdomBuildings: this.kingdomBuildings.map(
        b => ({x: b.x, y: b.y, type: b.type})
      )
    }
  }

  static fromDBDocument(doc, game) {
    // Load from a database object/document.

    const user = new User(game)
    user.username = doc.username || 'Unnamed'
    user.kingdomBuildings = doc.kingdomBuildings || []
    return user
  }
}
