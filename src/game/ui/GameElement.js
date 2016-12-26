const ansi = require('../../lib/ansi')

const FocusElement = require('../../lib/ui/form/FocusElement')

const Home =      require('./Home')
const MainMenu =  require('./MainMenu')
const Battle =    require('./battle/Battle')

module.exports = class GameElement extends FocusElement {
  // The game's main element control class. It also handles all interaction
  // for per-user things.

  constructor(game, flushable) {
    super()

    this.game = game
    this.flushable = flushable
    this.user = null

    this.mainMenu = new MainMenu(this.game)
    this.addChild(this.mainMenu)

    this.home = new Home()
    this.home.visible = false
    this.addChild(this.home)

    this.battle = null

    this.initEventListeners()
  }

  initEventListeners() {
    this.mainMenu.on('loggedin', user => this.loggedInAs(user))
    this.home.on('saverequested', () => this.saveRequested())
    this.home.on('battlerequested', dunCls => this.battleRequested(dunCls))
  }

  fixLayout() {
    this.w = this.parent.contentW
    this.h = this.parent.contentH
  }

  run() {
    // Call this after adding it to the root.

    this.root.select(this.mainMenu)
  }

  loggedInAs(user) {
    // Called in MainMenu when the user logs in.

    this.user = user

    this.mainMenu.visible = false
    this.home.visible = true
    this.root.select(this.home)

    this.home.loadUser(user)
  }

  keyPressed(keyBuf) {
    if (keyBuf[0] === 0x11) { // ^Q
      this.quitRequested()
    }
  }

  saveRequested() {
    // Called in Home when the combo ^S is pressed.

    this.saveUser()
  }

  quitRequested() {
    // Called in any part of the game (GameElement) when the combo ^Q is
    // pressed.

    if (this.user) {
      this.saveUser()
    }

    this.root.cleanTelnetOptions()
    this.flushable.target.write(ansi.clearScreen())
    this.flushable.target.write(ansi.moveCursor(0, 0))
    this.flushable.target.write('Goodbye!')
    this.flushable.target.write(ansi.moveCursor(1, 0))
    this.flushable.target.end()
  }

  battleRequested(dunCls) {
    this.home.visible = false

    if (this.battle) {
      this.removeChild(this.battle)
    }

    this.battle = new Battle(dunCls, this)
    this.addChild(this.battle)
    this.battle.fixLayout()

    this.root.select(this.battle)
  }

  saveUser() {
    this.user.saveAll({
      kingdomBuildings: this.home.kingdomBuildings
    })
  }
}
