const promisify = require('es6-promisify')

const bind = (o, p) => o[p].bind(o)
const promisifyMethod = (o, p) => promisify(bind(o, p))

const ansi = require('../ansi')
const Pane = require('../ui/Pane')
const Label = require('../ui/Label')

module.exports = class Game {
  constructor() {
    this.db = null
  }

  handleConnection(socket) {
    let socketWidth = 80
    let socketHeight = 24

    socket.write(ansi.clearScreen())

    const p = new Pane()
    p.w = socketWidth
    p.h = socketHeight

    const p2 = new Pane()
    p2.x = 7
    p2.y = 5
    p2.w = 8
    p2.h = 3
    p2.frameColor = ansi.C_BLUE
    p.addChild(p2)

    const text = new Label('Hi')
    p2.addChild(text)

    p.drawTo(socket)

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
