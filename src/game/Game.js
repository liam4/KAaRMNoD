const promisify = require('es6-promisify')

const bind = (o, p) => o[p].bind(o)
const promisifyMethod = (o, p) => promisify(bind(o, p))

const ansi =      require('../lib/ansi')
const Flushable = require('../lib/Flushable')

const Root =      require('../lib/ui/Root')

const MainMenu =  require('./ui/MainMenu')

module.exports = class Game {
  constructor() {
    this.db = null
  }

  handleConnection(socket) {
    const flushable = new Flushable(socket)

    flushable.write(ansi.clearScreen())
    flushable.flush()

    const root = new Root(socket)
    root.w = 80
    root.h = 24
    this.root = root

    const mainMenu = new MainMenu()
    root.addChild(mainMenu)
    root.select(mainMenu)

    const flushInterval = setInterval(() => {
      root.drawTo(flushable)
      flushable.flush()
    }, 20)

    socket.on('end', () => clearInterval(flushInterval))

    // this.dbInsert([{a: 5}, {a: 42}]).catch(err => {
    //   console.log(err)
    // })
  }

  dbInsert(...args) {
    return promisifyMethod(this.db, 'insert')(...args)
  }
}
