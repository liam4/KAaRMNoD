const FocusElement = require('./FocusElement')

module.exports = class Form extends FocusElement {
  constructor() {
    super()

    this.inputs = []
    this.curIndex = 0
  }

  addInput(input, asChild = true) {
    // Adds the given input as a child element and pushes it to the input
    // list. If the second optional, asChild, is false, it won't add the
    // input element as a child of the form.

    this.inputs.push(input)

    if (asChild) {
      this.addChild(input)
    }
  }

  keyPressed(keyBuf) {
    if (keyBuf[0] === 0x09) {
      // No inputs to tab through, so do nothing.
      if (this.inputs.length < 2) {
        return
      }

      this.curIndex = (this.curIndex + 1) % this.inputs.length

      const nextInput = this.inputs[this.curIndex]
      this.root.select(nextInput)

      return false
    }
  }
  
  focus() {
    this.root.select(this.inputs[this.curIndex])
  }
}
