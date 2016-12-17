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

    const root = new Root()
    root.w = 80
    root.h = 24

    const pane = new Pane()
    pane.x = 0
    pane.y = 0
    pane.w = root.w
    pane.h = root.h - 4
    pane.frameColor = ansi.C_BLUE
    root.addChild(pane)

    const label1 = new Label('Name:')
    pane.addChild(label1)

    const ti1 = new TextInput()
    ti1.x = label1.right + 2
    ti1.w = pane.contentW - ti1.left
    pane.addChild(ti1)

    const label2 = new Label('Fave. Color:')
    label2.y = 1
    pane.addChild(label2)

    const ti2 = new TextInput()
    ti2.y = label2.y
    ti2.x = label2.right + 2
    ti2.w = pane.contentW - ti2.left
    pane.addChild(ti2)

    const pane2 = new Pane()
    pane2.w = root.w
    pane2.h = 4
    pane2.x = 0
    pane2.y = pane.bottom + 1
    pane2.frameColor = ansi.C_RED
    root.addChild(pane2)

    const flushInterval = setInterval(() => {
      root.drawTo(flushable)
      flushable.flush()
    }, 20)

    socket.on('end', () => clearInterval(flushInterval))

    ti1.focus(socket).then(name => {
      const newLabel = new Label(name)
      newLabel.y = 0
      pane2.addChild(newLabel)
      return ti2.focus(socket)
    }).then(faveColor => {
      const newLabel = new Label(faveColor)
      newLabel.y = 1
      pane2.addChild(newLabel)
      root.selected = null
    })

    // this.dbInsert([{a: 5}, {a: 42}]).then(newDocs => {
    //   console.log(newDocs)
    // }).catch(err => {
    //   console.log(err)
    // })
  }

  dbInsert(...args) {
    return promisifyMethod(this.db, 'insert')(...args)
  }
}
