const Datastore = require('nedb')

const Game = require('./Game')

function loadDatabase(db) {
  return new Promise((resolve, reject) => {
    db.loadDatabase(err => {
      if (err) reject(err)
      resolve(db)
    })
  })
}

module.exports = function gameInit(conf) {
  return loadDatabase(new Datastore({
    filename: `${conf.dbPath}/users.db`
  })).then(userDB => {
    const game = new Game()
    game.userDB = userDB

    return game
  })
}
