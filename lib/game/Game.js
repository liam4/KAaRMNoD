const promisify = require('es6-promisify')

const bind = (o, p) => o[p].bind(o)
const promisifyMethod = (o, p) => promisify(bind(o, p))

const ansi = require('../ansi')

const Flushable = require('../Flushable')
const Root = require('../ui/Root')
const Pane = require('../ui/Pane')
const Label = require('../ui/Label')
const TextInput = require('../ui/form/TextInput')

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

    const pane = new Pane()
    pane.x = Math.floor(root.w / 2 - 12)
    pane.y = Math.ceil(root.h / 2 - 2)
    pane.w = 24
    pane.h = 3
    root.addChild(pane)

    const ti = new TextInput()
    ti.w = pane.contentW
    pane.addChild(ti)

    ti.focus()

    ti.on('value', (val) => {
      console.log(val)
    })

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
