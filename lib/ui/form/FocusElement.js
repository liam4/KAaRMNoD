const DisplayElement = require('../DisplayElement')

module.exports = class FocusElement extends DisplayElement {
  // A basic element that can receive cursor focus.

  constructor() {
    super()

    this.cursorX = 0
    this.cursorY = 0
  }

  focus(socket) {
    // Do something with socket. Should be overridden in subclasses.

    this.root.selected = this
  }

  get absCursorX() { return this.absX + this.cursorX }
  get absCursorY() { return this.absY + this.cursorY }
}
