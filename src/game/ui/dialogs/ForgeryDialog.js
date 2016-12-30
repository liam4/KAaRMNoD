const Dialog = require('./Dialog')
const FocusBox = require('../../../lib/ui/form/FocusBox')

const ListScrollForm = require('../../../lib/ui/form/ListScrollForm')
const Label =          require('../../../lib/ui/Label')
const Pane =           require('../../../lib/ui/Pane')

class ForgeryItem extends FocusBox {
  constructor(n) {
    super()

    this.pane = new Pane()
    this.addChild(this.pane)

    this.label = new Label(`n=${n}`)
    this.pane.addChild(this.label)
  }

  fixLayout() {
    this.pane.w = this.contentW
    this.pane.h = this.contentH
  }
}

module.exports = class ForgeryDialog extends Dialog {
  constructor() {
    super()

    this.form = new ListScrollForm('horizontal')
    this.pane.addChild(this.form)

    this.forgeryItems = []

    for (let i = 0; i < 8; i++) {
      const fi = new ForgeryItem(i)
      this.forgeryItems.push(fi)
      this.form.addInput(fi)
    }
  }

  fixLayout() {
    super.fixLayout()

    this.pane.w = this.contentW - 10
    this.pane.h = this.contentH - 5
    this.pane.centerInParent()

    this.form.w = this.pane.contentW
    this.form.h = this.pane.contentH

    for (let fi of this.forgeryItems) {
      fi.w = 14
      fi.h = this.form.contentH
      fi.fixLayout()
    }

    this.form.fixLayout()
  }

  focus() {
    this.root.select(this.form)
    this.fixLayout()
  }
}
