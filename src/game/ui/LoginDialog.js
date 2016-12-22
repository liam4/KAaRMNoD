const ansi = require('../../lib/ansi')
const telc = require('../../lib/telchars')

const FocusElement = require('../../lib/ui/form/FocusElement')

const Pane =      require('../../lib/ui/Pane')
const Label =     require('../../lib/ui/Label')
const Form =      require('../../lib/ui/form/Form')
const TextInput = require('../../lib/ui/form/TextInput')
const Button =    require('../../lib/ui/form/Button')

module.exports = class LoginDialog extends FocusElement {
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

    this.loginButton = new Button('Log In')
    this.form.addInput(this.loginButton)

    this.errorLabel = new Label()
    this.errorLabel.textAttributes = [ansi.C_RED]
    this.form.addChild(this.errorLabel)

    this.loginButton.on('pressed', () => this.loginPressed())
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

    this.loginButton.x = 0
    this.loginButton.y = this.form.contentH - 1

    this.errorLabel.x = this.loginButton.text.length + 1
    this.errorLabel.y = this.loginButton.y
  }

  focus() {
    this.root.select(this.usernameInput)
  }

  loginPressed() {
    this.errorLabel.text = ''

    this.game.login(this.usernameInput.value)
      .then(user => {
        this.emit('loggedin', user)
      })
      .catch(err => {
        if (err.code === 'ENOUSERFOUND') {
          this.errorLabel.text = 'No user found!'
        } else {
          throw err
        }
      })
  }

  keyPressed(keyBuf) {
    if (telc.isCancel(keyBuf)) {
      this.emit('cancelled')
    }
  }
}
