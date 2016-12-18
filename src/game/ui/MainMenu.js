const FocusElement = require('../../lib/ui/form/FocusElement')

const Pane =      require('../../lib/ui/Pane')
const Label =     require('../../lib/ui/Label')
const Form =      require('../../lib/ui/form/Form')
const TextInput = require('../../lib/ui/form/TextInput')
const Button =    require('../../lib/ui/form/Button')

const LoginDialog =  require('./LoginDialog')
const SignupDialog = require('./SignupDialog')

module.exports = class MainMenu extends FocusElement {
  constructor(game) {
    super()

    this.game = game

    this.pane = new Pane()
    this.addChild(this.pane)

    this.form = new Form()
    this.pane.addChild(this.form)

    this.loginButton = new Button('Log in')
    this.form.addInput(this.loginButton)

    this.signupButton = new Button('Sign up')
    this.form.addInput(this.signupButton)

    this.loginButton.on('pressed', () => this.loginPressed())
    this.signupButton.on('pressed', () => this.signupPressed())
  }

  fixLayout() {
    this.w = this.parent.contentW
    this.h = this.parent.contentH

    this.pane.w = 40
    this.pane.h = 3
    this.pane.centerInParent()

    this.form.w = this.pane.contentW
    this.form.h = this.pane.contentH

    this.signupButton.x = this.pane.contentW - this.signupButton.text.length
  }

  focus() {
    this.root.select(this.loginButton)
  }

  loginPressed() {
    const loginDialog = new LoginDialog(this.game)
    this.addChild(loginDialog)
    this.root.select(loginDialog)
  }

  signupPressed() {
    const signupDialog = new SignupDialog(this.game)
    this.addChild(signupDialog)
    this.root.select(signupDialog)
  }
}
