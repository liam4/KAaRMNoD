const Pane =  require('../../lib/ui/Pane')

const Label = require('../../lib/ui/Label')

module.exports = class UserPane extends Pane {
  constructor() {
    super()

    // Set this when the user is logged in.
    this.user = null

    this.label = new Label('Hello, world!')
    this.addChild(this.label)
  }

  fixLayout() {
    this.label.x = 0
    this.label.y = 0
  }

  drawTo(writable) {
    let text = ''

    if (!this.user) {
      text += 'No user..'
    } else {
      text += this.user.username
      text += ' -- '
      text += this.user.gold + 'G'
    }

    this.label.text = text

    super.drawTo(writable)
  }
}
