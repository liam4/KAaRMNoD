const Form = require('./Form')

module.exports = class ListScrollForm extends Form {
  // A form that lets the user scroll through a list of items. It
  // automatically adjusts to always allow the selected item to be visible.

  constructor() {
    super()

    this.scrollItems = 0
  }

  fixLayout() {
    let nextY = (this.inputs.slice(0, this.scrollItems)
      .reduce((a, b) => a - b.h, 0))

    for (let input of this.inputs) {
      input.y = nextY
      nextY += input.h

      if (input.bottom > this.bottom) {
        input.visible = false
        break
      }

      if (input.top < this.top) {
        input.visible = false
      }

      if (input.top >= this.top && input.bottom <= this.bottom) {
        input.visible = true
      }
    }
  }

  keyPressed(keyBuf) {
    super.keyPressed(keyBuf)

    const sel = this.inputs[this.curIndex]
    if (sel.top < 0) {
      this.scrollItems = this.curIndex
    } else if (sel.bottom > this.contentH) {
      this.scrollItems = this.curIndex - 1
    }

    this.fixLayout()
  }
}
