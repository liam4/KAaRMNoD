module.exports = class User {
  // The basic user class.

  constructor(game) {
    this.game = game
    this.username = null
    this.kingdomBuildingDocs = []
    this.gold = 0
  }

  saveAll(obj) {
    const doc = this.save(obj)

    // console.log('Save:', doc)

    this.dbUpdate(doc)
  }

  dbUpdate(doc) {
    this.game.dbUpdate(this.game.userDB, {username: this.username}, doc)
  }

  save({kingdomBuildings = []} = {}) {
    // Use saveAll to write to the database! This just generates the object
    // that would be written to the database.

    return {
      username: this.username,
      kingdomBuildings: kingdomBuildings.map(b => b.save()),
      gold: this.gold
    }
  }

  saveGold() {
    // Saves the amount of gold the user has in the user database.

    this.dbUpdate({
      $set: {
        gold: this.gold
      }
    })
  }

  saveBuildings(buildings) {
    // TODO: Duplicate of code in save

    this.dbUpdate({
      $set: {
        kingdomBuildings: buildings.map(b => b.save())
      }
    })
  }

  load(doc) {
    this.username = doc.username || 'Unnamed'
    this.kingdomBuildingDocs = doc.kingdomBuildings || []
    this.gold = doc.gold || 0
  }

  static fromDocument(doc, game) {
    const user = new User(game)
    user.load(doc)
    return user
  }
}
