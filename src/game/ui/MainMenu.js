const ansi = require('../../lib/ansi')

const FocusElement = require('../../lib/ui/form/FocusElement')

const Pane =      require('../../lib/ui/Pane')
const Label =     require('../../lib/ui/Label')
const Form =      require('../../lib/ui/form/Form')
const TextInput = require('../../lib/ui/form/TextInput')
const Button =    require('../../lib/ui/form/Button')

const LoginDialog =  require('./dialogs/LoginDialog')
const SignupDialog = require('./dialogs/SignupDialog')

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

    // K&ARMNOD(O) - Knights & a Relatively Minimal Number of Dragons Online
    // "karm" "nod" "oh"
    this.titleLabel = new Label(
      'Knights & a Relatively Minimal Number of Dragons')
    this.titleLabel.textAttributes = [ansi.C_CYAN, ansi.A_BRIGHT]
    this.addChild(this.titleLabel)

    this.subtitleLabel = new Label('- Online -')
    this.subtitleLabel.textAttributes = [ansi.C_CYAN, ansi.A_DIM]
    this.addChild(this.subtitleLabel)

    this.label1 = new Label('Press TAB to move through the UI.')
    this.label2 = new Label('Press SPACE/ENTER to select something.')
    this.label3 = new Label('Press ^Q to quit.')

    this.addChild(this.label1)
    this.addChild(this.label2)
    this.addChild(this.label3)

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

    this.titleLabel.x = Math.floor((this.contentW - this.titleLabel.w) / 2)
    this.subtitleLabel.x = Math.floor(
      (this.contentW - this.subtitleLabel.w) / 2)
    this.label1.x = Math.floor((this.contentW - this.label1.w) / 2)
    this.label2.x = Math.floor((this.contentW - this.label2.w) / 2)
    this.label3.x = Math.floor((this.contentW - this.label3.w) / 2)

    this.titleLabel.y = this.pane.top - 5
    this.subtitleLabel.y = this.titleLabel.y + 1
    this.label1.y = this.pane.top + 5
    this.label2.y = this.label1.y + 1
    this.label3.y = this.label2.y + 1

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
