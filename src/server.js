const net = require('net')

// TODO: remove this, because deprecation fun
process.on('unhandledRejection', err => { throw err })

require('./src/game/gameInit')({
  dbPath: __dirname + '/db'
}).then(game => {
  const server = new net.Server(socket => game.handleConnection(socket))

  server.listen(8008)
})
