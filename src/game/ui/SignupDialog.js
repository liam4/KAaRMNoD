const ansi = require('../../lib/ansi')

const FocusElement = require('../../lib/ui/form/FocusElement')

const Pane =      require('../../lib/ui/Pane')
const Label =     require('../../lib/ui/Label')
const Form =      require('../../lib/ui/form/Form')
const TextInput = require('../../lib/ui/form/TextInput')
const Button =    require('../../lib/ui/form/Button')

module.exports = class SignupDialog extends FocusElement {
  constructor(game) {
    super()

    this.game = game

    this.pane = new Pane()
    this.addChild(this.pane)

    this.form = new Form()
    this.pane.addChild(this.form)

    this.usernameLabel = new Label('Username:')
    this.form.addChild(this.usernameLabel)

    this.usernameInput = new TextInput()
    this.form.addInput(this.usernameInput)

    this.signupButton = new Button('Sign up')
    this.form.addInput(this.signupButton)

    this.signupStatus = new Label()
    this.form.addChild(this.signupStatus)
  }

  fixLayout() {
    this.w = this.parent.contentW
    this.h = this.parent.contentH

    this.pane.w = 30
    this.pane.h = 5
    this.pane.centerInParent()

    this.form.w = this.pane.contentW
    this.form.h = this.pane.contentH

    this.usernameLabel.x = 0
    this.usernameLabel.y = 0

    this.usernameInput.x = this.usernameLabel.right + 1
    this.usernameInput.y = this.usernameLabel.y
    this.usernameInput.w = this.form.contentW - this.usernameInput.x

    this.signupButton.x = 0
    this.signupButton.y = this.form.contentH - 1

    this.signupStatus.x = this.signupButton.text.length + 1
    this.signupStatus.y = this.signupButton.y

    this.signupButton.on('pressed', () => this.signupPressed())
  }

  focus() {
    this.root.select(this.usernameInput)
  }

  signupPressed() {
    this.game.signup(this.usernameInput.value)
      .then(user => {
        this.signupStatus.text = 'Signed up!'
        this.signupStatus.textColor = ansi.C_GREEN
      })
      .catch(err => {
        console.log(err)
      })
  }
}
