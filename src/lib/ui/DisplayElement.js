const EventEmitter = require('events')

module.exports = class DisplayObject extends EventEmitter {
  // A general class that handles dealing with screen coordinates, the tree
  // of elements, and other common stuff.
  //
  // This element doesn't handle any real rendering; just layouts. Placing
  // characters at specific positions should be implemented in subclasses.
  //
  // It's a subclass of EventEmitter, so you can make your own events within
  // the logic of your subclass.

  constructor() {
    super()

    this.parent = null
    this.children = []

    this.x = 0
    this.y = 0
    this.w = 0
    this.h = 0

    this.hPadding = 0
    this.vPadding = 0

    this.lastDrawnTarget = null
  }

  drawTo(writable) {
    // Writes text to a "writable" - an object that has a "write" method.
    // Custom rendering should be handled as an override of this method in
    // subclasses of DisplayObject. (This method does do other various
    // rendering things to be convenient, though, so use super.drawTo() at
    // the end of your override.)

    this.lastDrawnTarget = writable
    this.drawChildrenTo(writable)
  }

  fixLayout() {
    // Adjusts the layout of children in this element. If your subclass has
    // any children in it, you should override this method.
  }

  drawChildrenTo(writable) {
    // Draws all of the children to a writable.

    for (let child of this.children) {
      child.drawTo(writable)
    }
  }

  addChild(child) {
    // TODO Don't let a direct ancestor of this be added as a child. Don't
    // let itself be one of its childs either!

    child.parent = this
    this.children.push(child)
    child.fixLayout()
  }

  centerInParent() {
    // Utility function to center this element in its parent. Must be called
    // only when it has a parent. Set the width and height of the element
    // before centering it!

    if (this.parent === null) {
      throw new Error('Cannot center in parent when parent is null')
    }

    this.x = Math.floor((this.parent.w - this.w) / 2)
    this.y = Math.floor((this.parent.h - this.h) / 2)
  }

  get root() {
    let el = this
    while (el.parent) {
      el = el.parent
    }
    return el
  }

  get directAncestors() {
    const ancestors = []
    let el = this
    while (el.parent) {
      el = el.parent
      ancestors.push(el)
    }
    return ancestors
  }

  get absX() {
    if (this.parent) {
      return this.parent.contentX + this.x
    } else {
      return this.x
    }
  }

  get absY() {
    if (this.parent) {
      return this.parent.contentY + this.y
    } else {
      return this.y
    }
  }

  // Where contents should be positioned.
  get contentX() { return this.absX + this.hPadding }
  get contentY() { return this.absY + this.vPadding }
  get contentW() { return this.w - this.hPadding * 2 }
  get contentH() { return this.h - this.vPadding * 2 }

  get left()   { return this.x }
  get right()  { return this.x + this.w }
  get top()    { return this.y }
  get bottom() { return this.y + this.h }

  get absLeft()   { return this.absX }
  get absRight()  { return this.absX + this.w - 1 }
  get absTop()    { return this.absY }
  get absBottom() { return this.absY + this.h - 1 }
}
