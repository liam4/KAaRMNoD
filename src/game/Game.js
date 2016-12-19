const promisify = require('es6-promisify')

const bind = (o, p) => o[p].bind(o)
const promisifyMethod = (o, p) => promisify(bind(o, p))

const exception = require('../lib/exception')
const ansi =      require('../lib/ansi')
const Flushable = require('../lib/Flushable')

const Root =      require('../lib/ui/Root')

const MainMenu =  require('./ui/MainMenu')
const Home =      require('./ui/Home')

module.exports = class Game {
  constructor() {
    this.userDB = null
  }

  handleConnection(socket) {
    console.log('')

    const flushable = new Flushable(socket, true)

    flushable.write(ansi.clearScreen())
    flushable.flush()

    const root = new Root(socket)
    root.w = 80
    root.h = 24

    const mainMenu = new MainMenu(this)
    root.addChild(mainMenu)
    root.select(mainMenu)

    // const home = new Home()
    // root.addChild(home)
    // root.select(home)

    root.fixAllLayout()

    const flushInterval = setInterval(() => {
    // const flushInterval = setTimeout(() => {
      root.renderTo(flushable)
      flushable.flush()
    }, 100)

    socket.on('end', () => clearInterval(flushInterval))

    // this.dbInsert([{a: 5}, {a: 42}]).catch(err => {
    //   console.log(err)
    // })
  }

  login(username) {
    // Log in as the given username. Resolves the user object. If no user is
    // found, throws an error with the code ENOUSERFOUND.

    return this.dbFind(this.userDB, {'username': String(username)})
      .then(docs => {
        if (docs.length > 0) {
          return docs[0]
        }

        throw exception('ENOUSERFOUND', `No user with name ${username} found`)
      })
  }

  signup(username) {
    // Sign up as the given username. Returns the new user object.

    return this.dbInsert(this.userDB, {'username': String(username)})
      .then(docs => {
        return docs[0]
      })
  }

  dbFind(db, ...args) {
    return promisifyMethod(db, 'find')(...args)
  }

  dbInsert(db, ...args) {
    return promisifyMethod(db, 'insert')(...args)
  }
}
