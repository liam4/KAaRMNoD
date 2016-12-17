module.exports = class DisplayObject {
  // A general class that handles dealing with screen coordinates, the tree
  // of elements, and other common stuff.

  constructor() {
    this.parent = null
    this.children = []

    this.x = 0
    this.y = 0
    this.w = 0
    this.h = 0

    this.hPadding = 0
    this.vPadding = 0
  }

  addChild(child) {
    // TODO Don't let a direct ancestor of this be added as a child. Don't
    // let itself be one of its childs either!

    child.parent = this
    this.children.push(child)
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

  get left()   { return this.absX }
  get right()  { return this.absX + this.w - 1 }
  get top()    { return this.absY }
  get bottom() { return this.absY + this.h - 1 }
}
