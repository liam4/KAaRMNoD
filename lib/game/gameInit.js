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
  return loadDatabase(new Datastore({filename: conf.dbPath})).then(db => {
    const game = new Game()
    game.db = db

    return game
  })
}
