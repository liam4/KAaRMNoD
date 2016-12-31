module.exports = class Knight {
  // A knight, really a character that can be controlled by the player in a
  // battle.
  //
  // *Actually* it's just a container for that information..

  constructor() {
    // Initialize
    this.load({})
  }

  save() {
    return {
      name: this.name,
      stats: {
        maxHealth: this.stats.maxHealth,
        attack: this.stats.attack
      }
    }
  }

  load(doc) {
    this.name = (doc || 'Unnamed')

    const stats = (doc.stats || {})
    this.stats = {
      maxHealth: (stats.maxHealth || 0),
      attack: (stats.attack || 0)
    }
  }
}
