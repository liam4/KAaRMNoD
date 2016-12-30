// TODO: Should this be in lib..?

// TODO: Make the other dialogs actually use this class! Which means getting
// the 'cancelled' event handled everywhere..

const telc = require('../../../lib/telchars')

const FocusElement = require('../../../lib/ui/form/FocusElement')

const Pane = require('../../../lib/ui/Pane')

module.exports = class Dialog extends FocusElement {
  // A simple base dialog.
  //
  // Emits the 'cancelled' event when the cancel key (escape) is pressed,
  // which should (probably) be handled by the dialog's creator.
  //
  // Doesn't do anything when focused by default - this should be overridden
  // in subclasses.
  //
  // Automatically adjusts to fill its parent. Has a pane child (this.pane),
  // but the pane isn't adjusted at all (you should change its size and
  // likely center it in your subclass).

  constructor() {
    super()

    this.pane = new Pane()
    this.addChild(this.pane)
  }

  fixLayout() {
    this.w = this.parent.contentW
    this.h = this.parent.contentH
  }

  keyPressed(keyBuf) {
    if (telc.isCancel(keyBuf)) {
      this.emit('cancelled')
    }
  }
}
