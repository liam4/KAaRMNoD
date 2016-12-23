const promisify = require('es6-promisify')

const bind = (o, p) => o[p].bind(o)
const promisifyMethod = (o, p) => promisify(bind(o, p))

const exception = require('../lib/exception')
const ansi =      require('../lib/ansi')
const Flushable = require('../lib/Flushable')

const User = require('./User')

const Root =      require('../lib/ui/Root')

const GameElement = require('./ui/GameElement')

module.exports = class Game {
  constructor() {
    this.userDB = null
  }

  handleConnection(socket) {
    console.log('Connection gotten.')

    const flushable = new Flushable(socket, true)

    flushable.write(ansi.clearScreen())
    flushable.flush()

    const root = new Root(socket)

    root.requestTelnetWindowSize().then(({lines, cols}) => {
      root.w = cols
      root.h = lines
      flushable.screenLines = lines
      flushable.screenCols = cols

      const gameElement = new GameElement(this, flushable)
      root.addChild(gameElement)
      root.fixAllLayout()
      gameElement.run()

      const flushInterval = setInterval(() => {
      // const flushInterval = setTimeout(() => {
        root.renderTo(flushable)
        flushable.flush()
      }, 100)

      socket.on('end', () => clearInterval(flushInterval))
    })

    socket.on('end', () => flushable.end())
  }

  login(username) {
    // Log in as the given username. Resolves the user object. If no user is
    // found, throws an error with the code ENOUSERFOUND.

    return this.dbFind(this.userDB, {'username': String(username)})
      .then(docs => {
        if (docs.length > 0) {
          return User.fromDocument(docs[0], this)
        }

        throw exception('ENOUSERFOUND', `No user with name ${username} found`)
      })
  }

  signup(username) {
    // Sign up as the given username. Returns the new user object.

    return this.dbInsert(this.userDB, {'username': String(username)})
      .then(doc => User.fromDocument(doc, this))
  }

  dbFind(db, ...args) {
    return promisifyMethod(db, 'find')(...args)
  }

  dbInsert(db, ...args) {
    return promisifyMethod(db, 'insert')(...args)
  }

  dbUpdate(db, ...args) {
    return promisifyMethod(db, 'update')(...args)
  }
}
