const FocusElement = require('./FocusElement')

module.exports = class Form extends FocusElement {
  constructor() {
    super()

    this.inputs = []
  }

  addInput(input) {
    // Adds the given input as a child element and pushes it to the input
    // list.

    this.inputs.push(input)
    this.addChild(input)
  }

  handleKeyPressed(keyBuf) {
    if (keyBuf[0] === 0x09) {
      // No inputs to tab through, so do nothing.
      if (this.inputs.length < 2) {
        return
      }

      const nextInput = this.inputs[
        (this.inputs.indexOf(this.root.selected) + 1) %
        this.inputs.length
      ]
      this.root.select(nextInput)
      return false
    }
  }
}
