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

    this.loginDialog = new LoginDialog(this.game)
    this.loginDialog.visible = false
    this.addChild(this.loginDialog)

    this.signupDialog = new SignupDialog(this.game)
    this.signupDialog.visible = false
    this.addChild(this.signupDialog)

    this.initEventListeners()
  }

  initEventListeners() {
    this.loginButton.on('pressed', () => this.loginPressed())
    this.signupButton.on('pressed', () => this.signupPressed())
    this.loginDialog.on('loggedin', user => this.loggedInAs(user))
    this.loginDialog.on('cancelled', () => this.loginCancelled())
    this.signupDialog.on('cancelled', () => this.signupCancelled())
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
    this.root.select(this.form)
  }

  loginPressed() {
    this.loginDialog.visible = true
    this.root.select(this.loginDialog)
  }

  signupPressed() {
    this.signupDialog.visible = true
    this.root.select(this.signupDialog)
  }

  loggedInAs(user) {
    this.loginDialog.visible = false

    this.emit('loggedin', user)
  }

  loginCancelled() {
    this.loginDialog.visible = false
    this.root.select(this)
  }

  signupCancelled() {
    this.signupDialog.visible = false
    this.root.select(this.form)
  }
}
