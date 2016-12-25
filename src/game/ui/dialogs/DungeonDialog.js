const ansi = require('../../../lib/ansi')
const telc = require('../../../lib/telchars')
const wrap = require('../../../lib/util/wrap')

const FocusElement = require('../../../lib/ui/form/FocusElement')

const Label =  require('../../../lib/ui/Label')
const Pane =   require('../../../lib/ui/Pane')
const Form =   require('../../../lib/ui/form/Form')
const Button = require('../../../lib/ui/form/Button')

module.exports = class DungeonDialog extends FocusElement {
  constructor(dungeon) {
    super()

    this.dungeon = dungeon

    this.pane = new Pane()
    this.addChild(this.pane)

    this.titleLabel = new Label()
    this.titleLabel.textAttributes = [ansi.C_RED, ansi.A_BRIGHT]
    this.titleLabel.text = dungeon.title
    this.pane.addChild(this.titleLabel)

    this.lineLabels = []
    for (let line of wrap(dungeon.description, 30)) {
      const label = new Label(line)
      this.pane.addChild(label)
      this.lineLabels.push(label)
    }

    this.form = new Form()
    this.pane.addChild(this.form)

    this.difficultyButtons = [
      new Button('Normal'),
      new Button('Mighty'),
      new Button('Valour'),
      new Button('Honour'),
      new Button('Epic')
    ]

    for (let btn of this.difficultyButtons) {
      this.form.addInput(btn)
    }

    this.initEventListeners()
  }

  initEventListeners() {
    for (let btn of this.difficultyButtons) {
      btn.on('pressed', () => this.difficultySelected(btn))
    }
  }

  fixLayout() {
    this.w = this.parent.contentW
    this.h = this.parent.contentH

    this.pane.w = 44
    this.pane.h = this.lineLabels.length + 8
    this.pane.centerInParent()

    this.titleLabel.x = Math.floor(
      (this.pane.contentW - this.titleLabel.w) / 2)
    this.titleLabel.y = 1

    for (let i = 0; i < this.lineLabels.length; i++) {
      const label = this.lineLabels[i]
      label.y = this.titleLabel.bottom + 2 + i
      label.x = Math.floor((this.pane.contentW - label.w) / 2)
    }

    this.form.x = 3
    this.form.y = this.pane.contentH - 2

    let nextButtonX = 0
    for (let button of this.difficultyButtons) {
      button.x = nextButtonX
      nextButtonX = button.right + 2
    }
  }

  focus() {
    this.root.select(this.difficultyButtons[0])
  }

  keyPressed(keyBuf) {
    if (telc.isCancel(keyBuf)) {
      this.emit('cancelled')
    }
  }

  difficultySelected(button) {
    this.emit('difficultyselected', this.difficultyButtons.indexOf(button))
  }
}
