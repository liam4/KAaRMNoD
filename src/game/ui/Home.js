const unic =            require('../../lib/unichars')
const telc =            require('../../lib/telchars')
const ansi =            require('../../lib/ansi')
const buildingClasses = require('../buildings/buildingClasses')

const FocusElement = require('../../lib/ui/form/FocusElement')

const Pane =          require('../../lib/ui/Pane')
const UserPane =      require('./UserPane')
const WorldMap =      require('./WorldMap')
const BuildingTools = require('./BuildingTools')
const Shop =          require('./Shop')
const CancelDialog =  require('../../lib/ui/form/CancelDialog')
const SellDialog =    require('./dialogs/SellDialog')
const BuyDialog =     require('./dialogs/BuyDialog')

// Buildings
const MoneyBuilding =   require('../buildings/MoneyBuilding')
// const Fountain =        require('../buildings/Fountain')
// const TrainingGrounds = require('../buildings/TrainingGrounds')
// const Forgery =         require('../buildings/Forgery')

module.exports = class Home extends FocusElement {
  constructor(user) {
    super()

    this.user = null

    this.buildingZoneSize = 5

    this.kingdomBuildings = []

    this.mapLayoutChanged = false

    this.userPane = new UserPane()
    this.addChild(this.userPane)

    this.worldMapPane = new Pane()
    this.addChild(this.worldMapPane)

    this.worldMap = new WorldMap()
    this.worldMapPane.addChild(this.worldMap)

    this.buildingToolsPane = new Pane()
    this.buildingToolsPane.visible = false
    this.addChild(this.buildingToolsPane)

    this.buildingTools = new BuildingTools()
    this.buildingToolsPane.addChild(this.buildingTools)

    this.shopPane = new Pane()
    this.shopPane.visible = false
    this.worldMapPane.addChild(this.shopPane)

    this.shop = new Shop()
    this.shopPane.addChild(this.shop)

    this.initEventListeners()
  }

  initEventListeners() {
    this.worldMap.on('tileselected', t => this.tileSelected(t))
    this.buildingTools.on('cancelled', () => this.buildingToolsCancelled())
    this.buildingTools.on('usepressed', () => this.buildingToolsUsePressed())
    this.buildingTools.on('sellpressed',
      () => this.buildingToolsSellPressed())
    this.buildingTools.on('movepressed',
      () => this.buildingToolsMovePressed())
    this.shop.on('cancelled', () => this.shopCancelled())
    this.shop.on('itemselected', item => this.shopItemSelected(item))
  }

  fixLayout() {
    this.w = this.parent.contentW
    this.h = this.parent.contentH

    this.userPane.w = this.contentW
    this.userPane.h = 3
    this.worldMapPane.w = this.contentW
    this.worldMapPane.h = this.contentH - this.userPane.h
    this.userPane.x = 0
    this.userPane.y = this.worldMapPane.bottom

    this.worldMap.w = this.worldMapPane.contentW
    this.worldMap.h = this.worldMapPane.contentH

    if (this.buildingToolsPane.visible) {
      this.buildingToolsPane.h = 3
      this.buildingToolsPane.w = this.worldMapPane.w
      this.buildingToolsPane.x = this.worldMapPane.x
      this.buildingToolsPane.y = (
        this.worldMapPane.bottom - this.buildingToolsPane.h)
    }

    if (this.shopPane.visible) {
      this.shopPane.w = this.shopPane.parent.contentW - 10
      this.shopPane.h = this.shopPane.parent.contentH - 5
      this.shopPane.centerInParent()

      this.shop.w = this.shopPane.contentW
      this.shop.h = this.shopPane.contentH
    }
  }

  loadUser(user) {
    // Call this when the user is logged in.

    this.user = user
    this.userPane.user = user

    this.kingdomBuildings = this.user.kingdomBuildingDocs.map(doc => {
      let bObj = this.makeBuildingFromTitle(doc.title)

      if (bObj !== null) {
        bObj.load(doc)
      }

      return bObj
    }).filter(x => (x !== null))

    this.buildWorldMapTiles()
  }

  focus() {
    this.root.select(this.worldMap)
  }

  keyPressed(keyBuf) {
    if (keyBuf[0] === 0x13) {
      Pane.alert(this.root, 'Saving.')
      this.emit('saverequested')
    }
  }

  tileSelected(t) {
    if (!t || this.isMovingTile) return

    if (this.isTileInKingdom(t)) {
      const selectedBuilding = this.kingdomBuildings.filter(
        b => b.x === t.x && b.y === t.y)[0]

      if (selectedBuilding) {
        this.buildingTools.loadBuilding(selectedBuilding)

        this.buildingToolsPane.visible = true
        this.mapLayoutChanged = true
        this.fixAllLayout()

        this.root.select(this.buildingTools)
      } else {
        this.shopPane.visible = true
        this.shop.form.curIndex = 0
        this.fixAllLayout()

        this.root.select(this.shop)
      }
    }
  }

  isTileInKingdom(t) {
    // Returns whether or not the given tile is within the kingdom building
    // zone.

    return t.x < this.buildingZoneSize && t.y < this.buildingZoneSize
  }

  buildWorldMapTiles() {
    const buildingZoneSize = this.buildingZoneSize;

    const wallAttributes = [ansi.C_WHITE]

    // building space tiles
    for (let y = 0; y < buildingZoneSize; y++) {
      for (let x = 0; x < buildingZoneSize; x++) {
        const tile = this.kingdomBuildings.filter(
          t => t.x === x && t.y === y)[0]

        if (tile) {
          this.worldMap.setTileAt(x, y, tile)
        } else {
          this.setBlankTileAt(x, y)
        }
      }
    }

    // building space horizontal (south) wall
    for (let x = 0; x < buildingZoneSize; x++) {
      this.worldMap.setTileAt(x, buildingZoneSize, {
        textureAttributes: wallAttributes,
        texture: [
          '..........',
          '══════════',
          '──────────',
          '──────────',
          '══════════',
          '..........'
        ]
      })
    }

    // building space vertical (east) wall
    for (let y = 0; y < buildingZoneSize; y++) {
      this.worldMap.setTileAt(buildingZoneSize, y, {
        x: buildingZoneSize, y: y,
        textureAttributes: wallAttributes,
        texture: [
          '.║ │  │ ║.',
          '.║ │  │ ║.',
          '.║ │  │ ║.',
          '.║ │  │ ║.',
          '.║ │  │ ║.',
          '.║ │  │ ║.'
        ]
      })
    }

    // building space wall corner (southeast)
    this.worldMap.setTileAt(buildingZoneSize, buildingZoneSize, {
      x: buildingZoneSize, y: buildingZoneSize,
      textureAttributes: wallAttributes,
      texture: [
        '.║ │  │ ║.',
        '═╝ │  │ ║.',
        '───┘  │ ║.',
        '──────┘ ║.',
        '════════╝.',
        '..........'
      ]
    })
  }

  setBlankTileAt(x, y) {
    this.worldMap.setTileAt(x, y, {
      textureAttributes: [ansi.C_WHITE, ansi.A_DIM],
      texture: [
        '..........',
        '..........',
        '..........',
        '..........',
        '..........',
        '..........'
      ]
    })
  }

  buildingToolsCancelled() {
    this.closeBuildingTools()
  }

  buildingToolsUsePressed() {
    const { building } = this.buildingTools

    if (building instanceof MoneyBuilding) {
      const val = building.collectMoney()
      this.user.gold += val

      Pane.alert(this.root, `Collected ${val} gold!`)
      this.user.saveGold()
    }

    this.closeBuildingTools()
  }

  buildingToolsMovePressed() {
    const { building } = this.buildingTools

    this.buildingToolsPane.visible = false

    this.isMovingTile = true

    this.worldMap.cursorStyle = 'pick'

    const done = () => {
      this.worldMap.cursorStyle = 'nav'
      this.worldMap.removeListener('keypressed', cb)
      this.isMovingTile = false
    }

    const cb = keyBuf => {
      if (telc.isCancel(keyBuf)) {
        done()
      }
    }

    this.worldMap.on('keypressed', cb)

    this.worldMap.once('tileselected', tile => {
      if (tile) {
        this.setBlankTileAt(building.x, building.y)
        this.worldMap.setTileAt(tile.x, tile.y, building)

        done()

        this.user.saveBuildings(this.kingdomBuildings)
      }
    })

    this.root.select(this.worldMap)
  }

  buildingToolsSellPressed() {
    const { building } = this.buildingTools

    const dialog = new SellDialog(building)
    this.worldMapPane.addChild(dialog)
    this.root.select(dialog)

    dialog.on('cancelled', () => {
      this.worldMapPane.removeChild(dialog)
      this.root.select(this.buildingTools)
    })

    dialog.on('confirmed', () => {
      this.setBlankTileAt(building.x, building.y)
      this.kingdomBuildings.splice(
        this.kingdomBuildings.indexOf(building), 1)
      this.worldMapPane.removeChild(dialog)
      this.closeBuildingTools()

      this.user.gold += building.sellValue

      Pane.alert(this.root,
        `Sold ${building.title} for ${building.sellValue}G.`)

      this.user.saveGold()
      this.user.saveBuildings(this.kingdomBuildings)
    })
  }

  closeBuildingTools() {
    this.buildingToolsPane.visible = false
    this.mapLayoutChanged = true
    this.fixAllLayout()
    this.root.select(this.worldMap)
  }

  closeShopPane() {
    this.shopPane.visible = false
    this.fixAllLayout()
    this.root.select(this.worldMap)
  }

  shopCancelled() {
    this.closeShopPane()
  }

  shopItemSelected(item) {
    const cls = item.buildingClass
    const price = cls.price

    if (price > this.user.gold) {
      const dialog = new CancelDialog(
        `You need ${price - this.user.gold} more gold to buy ${cls.title}!`)

      this.addChild(dialog)
      this.root.select(dialog)

      dialog.on('cancelled', () => {
        this.removeChild(dialog)
        this.root.select(this.shop)
      })

      return
    }

    const dialog = new BuyDialog(cls)
    this.addChild(dialog)
    this.root.select(dialog)

    dialog.on('confirmed', () => {
      const {x, y} = this.worldMap.selectedTile

      const bObj = new cls()
      if (bObj) {
        bObj.x = x
        bObj.y = y
        this.kingdomBuildings.push(bObj)
        this.worldMap.setTileAt(x, y, bObj)
      } else {
        console.warn('Invalid building type from shop: ' + item.title)
      }

      Pane.alert(this.root, `Bought ${cls.title} for ${price}G.`)
      this.user.gold -= price

      this.removeChild(dialog)
      this.closeShopPane()

      this.user.saveGold()
      this.user.saveBuildings(this.kingdomBuildings)
    })

    dialog.on('cancelled', () => {
      this.removeChild(dialog)
      this.root.select(this.shop)
    })
  }

  makeBuildingFromTitle(title) {
    // Make a completely new building using the correct class, given a type.
    // If there is no class for the given type, null is returned.

    const cls = buildingClasses.fromTitle(title)
    return cls ? (new cls()) : null
  }
}
