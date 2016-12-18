const promisify = require('es6-promisify')

const bind = (o, p) => o[p].bind(o)
const promisifyMethod = (o, p) => promisify(bind(o, p))

const exception = require('../lib/exception')
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

    const mainMenu = new MainMenu(this)
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

  login(username) {
    // Log in as the given username. Resolves the user object. If no user is
    // found, throws an error with the code ENOUSERFOUND.

    return this.dbFind({ 'user.name': username }).then(docs => {
      if (docs.length > 0) {
        return docs[0]
      }

      throw exception('ENOUSERFOUND', `No user with name ${username} found`)
    })
  }

  dbFind(...args) {
    return promisifyMethod(this.db, 'find')(...args)
  }

  dbInsert(...args) {
    return promisifyMethod(this.db, 'insert')(...args)
  }
}
