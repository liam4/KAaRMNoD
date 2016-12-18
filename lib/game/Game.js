const promisify = require('es6-promisify')

const bind = (o, p) => o[p].bind(o)
const promisifyMethod = (o, p) => promisify(bind(o, p))

const ansi = require('../ansi')
const Flushable = require('../Flushable')

const Root = require('../ui/Root')
const Pane = require('../ui/Pane')
const Label = require('../ui/Label')
const Form = require('../ui/form/Form')
const TextInput = require('../ui/form/TextInput')
const ButtonInput = require('../ui/form/ButtonInput')

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
    pane.h = 5
    root.addChild(pane)

    const form = new Form()
    form.w = pane.contentW
    form.h = pane.contentH
    pane.addChild(form)

    const label1 = new Label('Foo:')
    label1.y = 0
    form.addChild(label1)

    const ti1 = new TextInput()
    ti1.x = label1.right + 2
    ti1.y = label1.y
    ti1.w = form.contentW - ti1.left
    form.addInput(ti1)

    const label2 = new Label('Baaaaz:')
    label2.y = label1.bottom + 1
    form.addChild(label2)

    const ti2 = new TextInput()
    ti2.x = label2.right + 2
    ti2.y = label2.y
    ti2.w = form.contentW - ti2.left
    form.addInput(ti2)

    const submit = new ButtonInput('Submit')
    submit.y = label2.bottom + 1
    form.addInput(submit)

    root.select(ti1)

    submit.on('pressed', (val) => {
      console.log('Foo: ' + ti1.value)
      console.log('Baaaaz: ' + ti2.value)
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
